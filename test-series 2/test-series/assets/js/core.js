// Small shared helpers used by all pages
export const ROOT = new URL('../../', import.meta.url).href;   // folder that contains index.html

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
export function qp(name) { return new URLSearchParams(location.search).get(name); }

// only allow redirecting back to a page on this same website
export function safeNext(n) {
  if (!n) return null;
  try { const u = new URL(n, location.href); return u.origin === location.origin ? u.href : null; } catch (e) { return null; }
}
export function initials(name, email) {
  const s = (name || '').trim();
  if (s) { const p = s.split(/\s+/); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); }
  return ((email || '?')[0] || '?').toUpperCase();
}
export function fmtDate(ms) {
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function fmtDateTime(ms) {
  return fmtDate(ms) + ', ' + new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
export function fmtDur(sec) { const m = Math.floor(sec / 60); return m + ' min ' + String(sec % 60).padStart(2, '0') + ' s'; }
export function r2(x) { return Math.round(x * 100) / 100; }

// localStorage key that is separate for every logged-in user
export function lk(id, suffix) { return 'bts:' + (window.BTS_UID ? window.BTS_UID + ':' : '') + id + ':' + suffix; }
export function lget(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
export function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

export function fatal(msg) {
  let d = document.getElementById('fatal');
  if (!d) { d = document.createElement('div'); d.id = 'fatal'; d.className = 'fatal'; document.body.prepend(d); }
  d.textContent = msg;
}

export function friendlyError(e) {
  const c = (e && e.code) || '';
  const map = {
    'auth/invalid-email': 'That email address does not look right.',
    'auth/missing-password': 'Please enter your password.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Network problem. Check your internet connection.',
    'auth/popup-closed-by-user': 'Sign-in window was closed before finishing.',
    'auth/unauthorized-domain': 'This website address is not authorised in Firebase. Add it under Authentication > Settings > Authorized domains.',
    'permission-denied': 'You do not have permission for this action.'
  };
  return map[c] || (e && e.message) || 'Something went wrong. Please try again.';
}

// load the Firebase wrapper; show a clear message if it is not configured yet
export async function loadFb() {
  try {
    return await import('./fb.js');
  } catch (e) {
    console.error(e);
    if (String(e && e.message).indexOf('FIREBASE_NOT_CONFIGURED') >= 0) {
      fatal('Setup pending: open assets/js/firebase-config.js and paste your Firebase config (see SETUP-GUIDE.txt).');
    } else {
      fatal('Could not connect to Firebase. Check your internet connection and the Firebase config.');
    }
    throw e;
  }
}
