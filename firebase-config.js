// Импорты Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============================================================
// 🔥 ВСТАВЬТЕ СВОИ ДАННЫЕ ИЗ FIREBASE CONSOLE
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCjMRzg8fNqfIT0ua2X_urqTePm7MYbQn8",
  authDomain: "foxline-site.firebaseapp.com",
  projectId: "foxline-site",
  storageBucket: "foxline-site.firebasestorage.app",
  messagingSenderId: "233149428799",
  appId: "1:233149428799:web:1712345a9fb0da0669348a",
  measurementId: "G-YTC21D3KMN"
};

// Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Firebase инициализирован');

// ============================================================
// ========== АВТОРИЗАЦИЯ ==========
// ============================================================

// Регистрация
async function registerUser(email, password, displayName) {
    try {
        console.log('📝 Начинаем регистрацию:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('✅ Пользователь создан в Auth:', user.uid);
        
        // Обновляем профиль с именем
        await updateProfile(user, { displayName: displayName });
        console.log('✅ Имя обновлено в Auth');
        
        // Сохраняем данные пользователя в Firestore
        const userData = {
            displayName: displayName,
            email: email,
            photoURL: '',
            createdAt: serverTimestamp()
        };
        
        await setDoc(doc(db, "users", user.uid), userData);
        console.log('✅ Данные сохранены в Firestore:', userData);
        
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        return { success: false, error: error.message };
    }
}

// Вход
async function loginUser(email, password) {
    try {
        console.log('🔑 Вход:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Вход выполнен:', userCredential.user.uid);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        return { success: false, error: error.message };
    }
}

// Выход
async function logoutUser() {
    try {
        await signOut(auth);
        console.log('✅ Выход выполнен');
        return { success: true };
    } catch (error) {
        console.error('❌ Ошибка выхода:', error);
        return { success: false, error: error.message };
    }
}

// Получить текущего пользователя
function getCurrentUser() {
    const user = auth.currentUser;
    console.log('👤 Текущий пользователь:', user ? user.uid : 'не авторизован');
    return user;
}

// Следить за состоянием авторизации
function onAuthStateChangedListener(callback) {
    return onAuthStateChanged(auth, (user) => {
        console.log('🔄 Состояние авторизации изменилось:', user ? user.uid : 'не авторизован');
        callback(user);
    });
}

// Восстановление пароля
async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================================
// ========== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (FIRESTORE) ==========
// ============================================================

// Получить данные пользователя из Firestore
async function getUserData(uid) {
    try {
        console.log('📖 Загрузка данных пользователя:', uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log('✅ Данные найдены:', docSnap.data());
            return { success: true, data: docSnap.data() };
        } else {
            console.log('⚠️ Документ не найден, создаём новый');
            // Если документа нет, создаём с базовыми данными
            const user = getCurrentUser();
            if (user) {
                const newData = {
                    displayName: user.displayName || user.email || 'Пользователь',
                    email: user.email,
                    photoURL: user.photoURL || '',
                    createdAt: serverTimestamp()
                };
                await setDoc(docRef, newData);
                console.log('✅ Создан новый документ:', newData);
                return { success: true, data: newData };
            }
            return { success: false, error: "Данные не найдены" };
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        return { success: false, error: error.message };
    }
}

// Обновить профиль пользователя
async function updateUserProfile(uid, data) {
    try {
        console.log('✏️ Обновление профиля:', uid, data);
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log('✅ Профиль обновлён в Firestore');
        
        // Также обновляем displayName в Auth
        const user = getCurrentUser();
        if (user) {
            if (data.displayName) {
                await updateProfile(user, { displayName: data.displayName });
                console.log('✅ Имя обновлено в Auth');
            }
            if (data.photoURL !== undefined) {
                await updateProfile(user, { photoURL: data.photoURL });
                console.log('✅ Аватарка обновлена в Auth');
            }
        }
        return { success: true };
    } catch (error) {
        console.error('❌ Ошибка обновления профиля:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================
// ========== КОММЕНТАРИИ (FIRESTORE) ==========
// ============================================================

// Добавить комментарий
async function addComment(titleId, text, rating) {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, error: "Необходимо авторизоваться" };
    }
    
    try {
        // Получаем данные пользователя
        const userData = await getUserData(user.uid);
        const displayName = userData.success ? userData.data.displayName : (user.displayName || "Аноним");
        const photoURL = userData.success ? userData.data.photoURL : (user.photoURL || '');
        
        const docRef = await addDoc(collection(db, "comments"), {
            titleId: titleId,
            uid: user.uid,
            name: displayName,
            photoURL: photoURL,
            text: text,
            rating: rating || 5,
            time: serverTimestamp()
        });
        
        console.log('✅ Комментарий добавлен, ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Ошибка добавления комментария:', error);
        return { success: false, error: error.message };
    }
}

// Получить комментарии для тайтла
async function getComments(titleId) {
    try {
        console.log('📖 Загрузка комментариев для:', titleId);
        const q = query(
            collection(db, "comments"),
            where("titleId", "==", titleId),
            orderBy("time", "desc")
        );
        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        console.log(`✅ Загружено ${comments.length} комментариев`);
        return comments;
    } catch (error) {
        console.error('❌ Ошибка загрузки комментариев:', error);
        return [];
    }
}

// Удалить комментарий
async function deleteComment(commentId) {
    const user = getCurrentUser();
    if (!user) return { success: false, error: "Не авторизован" };
    
    try {
        await deleteDoc(doc(db, "comments", commentId));
        console.log('✅ Комментарий удалён:', commentId);
        return { success: true };
    } catch (error) {
        console.error('❌ Ошибка удаления комментария:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================
// ========== ЭКСПОРТ ==========
// ============================================================

export {
    auth,
    db,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    onAuthStateChangedListener,
    getUserData,
    updateUserProfile,
    addComment,
    getComments,
    deleteComment,
    resetPassword
};

console.log('✅ Firebase подключён');
