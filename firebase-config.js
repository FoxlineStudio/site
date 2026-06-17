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
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    writeBatch,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============================================================
// 🔥 КОНФИГУРАЦИЯ FIREBASE
// ============================================================
const firebaseConfig = {
    apiKey: "AIzaSyCjMRzg8fNqfIT0ua2X_urqTePm7MYbQn8",
    authDomain: "foxline-site.firebaseapp.com",
    projectId: "foxline-site",
    storageBucket: "foxline-site.firebasestorage.app",
    messagingSenderId: "91239326767",
    appId: "1:91239326767:web:7488b92e5cf0a3d188fa82"
};

// ИНИЦИАЛИЗАЦИЯ
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('✅ Firebase подключён');

// ============================================================
// ========== АВТОРИЗАЦИЯ ==========
// ============================================================

async function registerUser(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: displayName });
        
        // Создаём пользователя в Firestore с ролью 'user'
        await setDoc(doc(db, "users", user.uid), {
            displayName: displayName,
            email: email,
            photoURL: '',
            role: 'user', // user, dubber, admin
            createdAt: serverTimestamp()
        });
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function getCurrentUser() {
    return auth.currentUser;
}

function onAuthStateChangedListener(callback) {
    return onAuthStateChanged(auth, callback);
}

async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================================
// ========== ПОЛЬЗОВАТЕЛИ (РОЛИ) ==========
// ============================================================

async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            // Создаём пользователя с ролью по умолчанию
            const user = getCurrentUser();
            if (user) {
                const newData = {
                    displayName: user.displayName || user.email || 'Пользователь',
                    email: user.email,
                    photoURL: user.photoURL || '',
                    role: 'user',
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

async function updateUserProfile(uid, data) {
    try {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        const user = getCurrentUser();
        if (user) {
            if (data.displayName) await updateProfile(user, { displayName: data.displayName });
            if (data.photoURL !== undefined) await updateProfile(user, { photoURL: data.photoURL });
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateUserRole(uid, newRole) {
    try {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, { role: newRole });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getAllUsers() {
    try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, users: users };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function isAdmin(uid) {
    const result = await getUserData(uid);
    if (result.success) {
        return result.data.role === 'admin';
    }
    return false;
}

async function isDubber(uid) {
    const result = await getUserData(uid);
    if (result.success) {
        return result.data.role === 'dubber' || result.data.role === 'admin';
    }
    return false;
}

// ============================================================
// ========== ДАННЫЕ (ТАЙТЛЫ, ДАББЕРЫ, РОЛИ) ==========
// ============================================================

// ---- ТАЙТЛЫ ----

async function getTitles() {
    try {
        const snapshot = await getDocs(collection(db, "titles"));
        const titles = [];
        snapshot.forEach(doc => {
            titles.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, titles: titles };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getTitleById(titleId) {
    try {
        const docRef = doc(db, "titles", titleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, error: "Тайтл не найден" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addTitle(titleData) {
    try {
        const docRef = await addDoc(collection(db, "titles"), {
            ...titleData,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateTitle(titleId, data) {
    try {
        const docRef = doc(db, "titles", titleId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteTitle(titleId) {
    try {
        await deleteDoc(doc(db, "titles", titleId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ---- ДАББЕРЫ ----

async function getVoices() {
    try {
        const snapshot = await getDocs(collection(db, "voices"));
        const voices = [];
        snapshot.forEach(doc => {
            voices.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, voices: voices };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getVoiceById(voiceId) {
    try {
        const docRef = doc(db, "voices", voiceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, error: "Даббер не найден" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addVoice(voiceData) {
    try {
        const docRef = await addDoc(collection(db, "voices"), {
            ...voiceData,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateVoice(voiceId, data) {
    try {
        const docRef = doc(db, "voices", voiceId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteVoice(voiceId) {
    try {
        await deleteDoc(doc(db, "voices", voiceId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ---- РОЛИ ----

async function getRoles() {
    try {
        const snapshot = await getDocs(collection(db, "roles"));
        const roles = [];
        snapshot.forEach(doc => {
            roles.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, roles: roles };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getRolesByTitleId(titleId) {
    try {
        const q = query(collection(db, "roles"), where("titleId", "==", titleId));
        const snapshot = await getDocs(q);
        const roles = [];
        snapshot.forEach(doc => {
            roles.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, roles: roles };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addRole(roleData) {
    try {
        const docRef = await addDoc(collection(db, "roles"), {
            ...roleData,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateRole(roleId, data) {
    try {
        const docRef = doc(db, "roles", roleId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteRole(roleId) {
    try {
        await deleteDoc(doc(db, "roles", roleId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ---- МАТЕРИАЛЫ ДЛЯ ОЗВУЧКИ (dub-in) ----

async function getDubMaterials(titleId) {
    try {
        const docRef = doc(db, "dubMaterials", titleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        }
        return { success: true, data: { raw: [], softsubs: [], hardsubs: [] } };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateDubMaterials(titleId, materialType, items) {
    try {
        const docRef = doc(db, "dubMaterials", titleId);
        await setDoc(docRef, {
            [materialType]: items,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addDubMaterial(titleId, materialType, item) {
    try {
        const docRef = doc(db, "dubMaterials", titleId);
        const docSnap = await getDoc(docRef);
        let existing = { raw: [], softsubs: [], hardsubs: [] };
        if (docSnap.exists()) {
            existing = docSnap.data();
        }
        existing[materialType].push(item);
        await setDoc(docRef, existing, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function removeDubMaterial(titleId, materialType, index) {
    try {
        const docRef = doc(db, "dubMaterials", titleId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, error: "Материалы не найдены" };
        }
        const data = docSnap.data();
        if (data[materialType] && data[materialType].length > index) {
            data[materialType].splice(index, 1);
            await setDoc(docRef, data);
            return { success: true };
        }
        return { success: false, error: "Элемент не найден" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================================
// ========== КОММЕНТАРИИ ==========
// ============================================================

async function addComment(titleId, text, rating) {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, error: "Необходимо авторизоваться" };
    }
    try {
        const userData = await getUserData(user.uid);
        const displayName = userData.success ? userData.data.displayName : (user.displayName || "Аноним");
        const photoURL = userData.success ? userData.data.photoURL : '';
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
        console.error('Ошибка загрузки комментариев:', error);
        return [];
    }
}

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
// ========== ИНИЦИАЛИЗАЦИЯ ДАННЫХ (ПЕРВЫЙ ЗАПУСК) ==========
// ============================================================

async function initializeData() {
    try {
        // Проверяем, есть ли уже тайтлы
        const titlesResult = await getTitles();
        if (titlesResult.success && titlesResult.titles.length > 0) {
            console.log('📊 Данные уже существуют в Firestore');
            return;
        }

        console.log('📝 Загрузка начальных данных в Firestore...');
        const batch = writeBatch(db);

        // Загружаем тайтлы из window.titlesDatabase
        if (window.titlesDatabase && window.titlesDatabase.length > 0) {
            for (const title of window.titlesDatabase) {
                const docRef = doc(db, "titles", title.id || title.name);
                batch.set(docRef, {
                    ...title,
                    createdAt: serverTimestamp()
                });
            }
        }

        // Загружаем дабберов
        if (window.voicesDatabase && window.voicesDatabase.length > 0) {
            for (const voice of window.voicesDatabase) {
                const docRef = doc(db, "voices", voice.id || voice.name);
                batch.set(docRef, {
                    ...voice,
                    createdAt: serverTimestamp()
                });
            }
        }

        // Загружаем роли
        if (window.rolesDatabase && window.rolesDatabase.length > 0) {
            for (const role of window.rolesDatabase) {
                const docRef = doc(db, "roles", role.id || `${role.titleId}_${role.voiceId}`);
                batch.set(docRef, {
                    ...role,
                    createdAt: serverTimestamp()
                });
            }
        }

        await batch.commit();
        console.log('✅ Начальные данные загружены в Firestore!');
    } catch (error) {
        console.error('❌ Ошибка загрузки начальных данных:', error);
    }
}
// Добавьте эту функцию в firebase-config.js

async function getUserRole(uid) {
    try {
        const result = await getUserData(uid);
        if (result.success) {
            return result.data.role || 'user';
        }
        return 'user';
    } catch (error) {
        return 'user';
    }
}
// ============================================================
// ========== ЭКСПОРТ ==========
// ============================================================

export {
    auth,
    db,
    // Авторизация
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    onAuthStateChangedListener,
    resetPassword,
    // Пользователи
    getUserData,
    updateUserProfile,
    updateUserRole,
    getAllUsers,
    isAdmin,
    isDubber,
    // Тайтлы
    getTitles,
    getTitleById,
    addTitle,
    updateTitle,
    deleteTitle,
    // Дабберы
    getVoices,
    getVoiceById,
    addVoice,
    updateVoice,
    deleteVoice,
    // Роли
    getRoles,
    getRolesByTitleId,
    addRole,
    updateRole,
    deleteRole,
    getUserRole,
    // Материалы
    getDubMaterials,
    updateDubMaterials,
    addDubMaterial,
    removeDubMaterial,
    // Комментарии
    addComment,
    getComments,
    deleteComment,
    // Инициализация
    initializeData
};

console.log('🔥 Модуль firebase-config.js загружен');