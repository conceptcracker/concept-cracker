// Login / Sign up page
import { ROOT, loadFb, qp, safeNext, friendlyError } from './core.js';

const $ = s => document.querySelector(s);
function show(msg, type) { const m = $('#msg'); m.className = 'msg ' + (type || 'err'); m.textContent = msg || ''; m.hidden = !msg; }
function busy(on) { document.querySelectorAll('button, input').forEach(b => { if (on) b.setAttribute('disabled', ''); else b.removeAttribute('disabled'); }); }

async function go(fb, user) {
  const p = await fb.ensureProfile(user);
  const next = safeNext(qp('next')) || (ROOT + 'index.html');
  if (!p.profileDone) location.replace(ROOT + 'profile.html?first=1&next=' + encodeURIComponent(next));
  else location.replace(next);
}

function tab(which) {
  const login = which !== 'signup';
  $('#tabLogin').classList.toggle('on', login);
  $('#tabSignup').classList.toggle('on', !login);
  $('#fLogin').hidden = !login;
  $('#fSignup').hidden = login;
  $('#title').textContent = login ? 'Welcome back' : 'Create your account';
  show('');
}

(async function main() {
  const fb = await loadFb();
  await fb.redirectResult();
  const u = await fb.currentUser();
  if (u && !qp('switch')) { await go(fb, u); return; }

  tab(qp('tab'));
  $('#tabLogin').onclick = () => tab('login');
  $('#tabSignup').onclick = () => tab('signup');

  async function run(fn) {
    show(''); busy(true);
    try { const user = await fn(); if (user) await go(fb, user); }
    catch (e) { show(friendlyError(e)); }
    finally { busy(false); }
  }

  $('#fLogin').onsubmit = e => {
    e.preventDefault();
    run(() => fb.signIn($('#lEmail').value.trim(), $('#lPass').value));
  };
  $('#fSignup').onsubmit = e => {
    e.preventDefault();
    const name = $('#sName').value.trim(), email = $('#sEmail').value.trim(), pw = $('#sPass').value;
    if (!name) { show('Please enter your full name.'); return; }
    if (pw.length < 6) { show('Password must be at least 6 characters.'); return; }
    if (pw !== $('#sPass2').value) { show('The two passwords do not match.'); return; }
    run(() => fb.signUp(email, pw, name));
  };
  document.querySelectorAll('.gbtn').forEach(b => { b.onclick = () => run(() => fb.signInGoogle()); });
  $('#forgot').onclick = async () => {
    const email = $('#lEmail').value.trim();
    if (!email) { show('Type your email above first, then tap "Forgot password".'); return; }
    show(''); busy(true);
    try { await fb.resetPassword(email); show('Password reset link sent to ' + email + '. Check your inbox (and spam).', 'okk'); }
    catch (e) { show(friendlyError(e)); }
    finally { busy(false); }
  };
})().catch(e => console.error(e));
