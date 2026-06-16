// Импорты Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
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
    serverTimestamp
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
        // Можно добавить имя в профиль
        // await updateProfile(userCredential.user, { displayName: displayName });
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
// ========== КОММЕНТАРИИ (FIRESTORE) ==========
// ============================================================

// Добавить комментарий
async function addComment(titleId, text, rating) {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, error: "Необходимо авторизоваться" };
    }
    
    try {
        const docRef = await addDoc(collection(db, "comments"), {
            titleId: titleId,
            uid: user.uid,
            name: user.displayName || user.email || "Аноним",
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
            comments.push({ id: doc.id, ...doc.data() });
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
    addComment,
    getComments,
    deleteComment
};

console.log('✅ Firebase подключён');