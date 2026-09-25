// ============================================================
//  Firebase wrapper - all Firebase calls live in this one file.
//  Collections use the "aptest_" prefix so they never clash with
//  anything already in your Firebase project.
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  updateProfile, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  sendPasswordResetEmail, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

if (!firebaseConfig || !firebaseConfig.apiKey || String(firebaseConfig.apiKey).indexOf('PASTE') === 0) {
  throw new Error('FIREBASE_NOT_CONFIGURED');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const C = { users: 'aptest_users', admins: 'aptest_admins', tests: 'aptest_tests', meta: 'aptest_meta' };

function slim(u) {
  return u ? { uid: u.uid, email: (u.email || '').toLowerCase(), name: u.displayName || '' } : null;
}

// resolves once Firebase has worked out whether someone is logged in
const firstAuth = new Promise(resolve => {
  const off = onAuthStateChanged(auth, u => { off(); resolve(u); });
});

/* ---------------- auth ---------------- */
export async function currentUser() { await firstAuth; return slim(auth.currentUser); }

export async function signUp(email, password, name) {
  const r = await createUserWithEmailAndPassword(auth, email, password);
  if (name) { try { await updateProfile(r.user, { displayName: name }); } catch (e) {} }
  return slim(auth.currentUser);
}
export async function signIn(email, password) {
  const r = await signInWithEmailAndPassword(auth, email, password);
  return slim(r.user);
}
export async function signInGoogle() {
  const p = new GoogleAuthProvider();
  try {
    const r = await signInWithPopup(auth, p);
    return slim(r.user);
  } catch (e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
      await signInWithRedirect(auth, p);   // page will reload after Google login
      return null;
    }
    throw e;
  }
}
export async function redirectResult() {
  try { const r = await getRedirectResult(auth); return r ? slim(r.user) : null; } catch (e) { return null; }
}
export async function resetPassword(email) { await sendPasswordResetEmail(auth, email); }
export async function logout() { await signOut(auth); }

/* ---------------- profile ---------------- */
export async function getProfile(uid) {
  const s = await getDoc(doc(db, C.users, uid));
  return s.exists() ? Object.assign({ uid }, s.data()) : null;
}
// creates the profile document the first time someone logs in (never approved by default)
export async function ensureProfile(user) {
  const ref = doc(db, C.users, user.uid);
  const s = await getDoc(ref);
  if (s.exists()) return Object.assign({ uid: user.uid }, s.data());
  const data = {
    name: user.name || '', email: user.email || '', phone: '', city: '', qualification: '', target: '',
    approved: false, profileDone: false, createdAt: Date.now()
  };
  await setDoc(ref, data);
  return Object.assign({ uid: user.uid }, data);
}
export async function saveProfile(uid, fields) {
  await updateDoc(doc(db, C.users, uid), Object.assign({}, fields, { updatedAt: Date.now() }));
}
export async function isAdmin(uid) {
  try { const s = await getDoc(doc(db, C.admins, uid)); return s.exists(); } catch (e) { return false; }
}

/* ---------------- tests (questions live in Firestore, protected by rules) ---------------- */
export async function getAllMeta() {
  const snap = await getDocs(collection(db, C.meta));
  const out = {};
  snap.forEach(d => { out[d.id] = d.data(); });
  return out;
}
export async function getTestQuestions(id) {
  const s = await getDoc(doc(db, C.tests, id));
  if (!s.exists()) return [];
  return JSON.parse(s.data().json);
}

/* ---------------- results ---------------- */
export async function saveResult(uid, res) {
  await setDoc(doc(db, C.users, uid, 'results', res.testId + '_' + res.ts), res);
}
export async function listResults(uid, testId) {
  const col = collection(db, C.users, uid, 'results');
  const snap = await getDocs(testId ? query(col, where('testId', '==', testId)) : col);
  const out = [];
  snap.forEach(d => out.push(d.data()));
  out.sort((a, b) => b.ts - a.ts);
  return out;
}

/* ---------------- admin ---------------- */
export async function listUsers() {
  const snap = await getDocs(collection(db, C.users));
  const out = [];
  snap.forEach(d => out.push(Object.assign({ uid: d.id }, d.data())));
  return out;
}
export async function setApproved(uid, value) {
  await updateDoc(doc(db, C.users, uid), { approved: !!value, approvedAt: Date.now() });
}
export async function putTest(id, list, title) {
  const max = list.reduce((a, q) => a + (q.m == null ? 3 : q.m), 0);
  const batch = writeBatch(db);
  batch.set(doc(db, C.tests, id), { json: JSON.stringify(list), n: list.length, updatedAt: Date.now() });
  batch.set(doc(db, C.meta, id), { n: list.length, max, title: title || id, updatedAt: Date.now() });
  await batch.commit();
}
export async function deleteTest(id) {
  const batch = writeBatch(db);
  batch.delete(doc(db, C.tests, id));
  batch.delete(doc(db, C.meta, id));
  await batch.commit();
}
