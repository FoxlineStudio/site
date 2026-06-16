// Импорты Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updateEmail,
    sendEmailVerification
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

// ============================================================
// ========== АВТОРИЗАЦИЯ ==========
// ============================================================

// Регистрация
async function registerUser(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Обновляем профиль с именем
        await updateProfile(userCredential.user, { displayName: displayName });
        // Сохраняем данные пользователя в Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            displayName: displayName,
            email: email,
            photoURL: '',
            createdAt: serverTimestamp()
        });
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Вход
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Выход
async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Получить текущего пользователя
function getCurrentUser() {
    return auth.currentUser;
}

// Следить за состоянием авторизации
function onAuthStateChangedListener(callback) {
    return onAuthStateChanged(auth, callback);
}

// ============================================================
// ========== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (FIRESTORE) ==========
// ============================================================

// Получить данные пользователя из Firestore
async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            // Если документа нет, создаём с базовыми данными
            const user = getCurrentUser();
            if (user) {
                const newData = {
                    displayName: user.displayName || user.email || 'Пользователь',
                    email: user.email,
                    photoURL: '',
                    createdAt: serverTimestamp()
                };
                await setDoc(docRef, newData);
                return { success: true, data: newData };
            }
            return { success: false, error: "Данные не найдены" };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Обновить профиль пользователя
async function updateUserProfile(uid, data) {
    try {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        // Также обновляем displayName в Auth
        const user = getCurrentUser();
        if (user && data.displayName) {
            await updateProfile(user, { displayName: data.displayName });
        }
        if (user && data.photoURL) {
            await updateProfile(user, { photoURL: data.photoURL });
        }
        return { success: true };
    } catch (error) {
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
        // Получаем актуальное имя пользователя из Firestore
        const userData = await getUserData(user.uid);
        const displayName = userData.success ? userData.data.displayName : (user.displayName || user.email || "Аноним");
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
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Получить комментарии для тайтла
async function getComments(titleId) {
    try {
        const q = query(
            collection(db, "comments"),
            where("titleId", "==", titleId),
            orderBy("time", "desc")
        );
        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Если у комментария нет photoURL, пробуем получить из users
            comments.push({ 
                id: doc.id, 
                ...data,
                // Если photoURL пустой, используем дефолтную аватарку
                photoURL: data.photoURL || ''
            });
        });
        return comments;
    } catch (error) {
        console.error("Ошибка загрузки комментариев:", error);
        return [];
    }
}

// Удалить комментарий (только свой)
async function deleteComment(commentId) {
    const user = getCurrentUser();
    if (!user) return { success: false, error: "Не авторизован" };
    
    try {
        await deleteDoc(doc(db, "comments", commentId));
        return { success: true };
    } catch (error) {
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
    deleteComment
};

console.log('✅ Firebase подключён');