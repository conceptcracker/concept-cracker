// Page bootstrap: login check, account icon (top right), local cache helpers
import { ROOT, loadFb, esc, initials, lget, lset } from './core.js';

export async function initPage(opts = {}) {
  const fb = await loadFb();
  const user = await fb.currentUser();
  let profile = null, admin = false;
  if (user) {
    try { profile = await fb.ensureProfile(user); } catch (e) { profile = await fb.getProfile(user.uid).catch(() => null); }
    admin = await fb.isAdmin(user.uid).catch(() => false);
  }
  window.BTS_UID = user ? user.uid : '';
  mountAccount(fb, user, profile, admin);

  if (opts.requireLogin && !user) {
    location.replace(ROOT + 'login.html?next=' + encodeURIComponent(location.href));
    await new Promise(() => {});
  }
  if (opts.requireAdmin && !admin) {
    document.body.innerHTML = '<div class="shell"><div class="empty"><h2>Admin only</h2><p>This page is only for the site admin.</p><a class="btn btn-navy" href="' + ROOT + 'index.html">Go home</a></div></div>';
    await new Promise(() => {});
  }
  return { fb, user, profile, admin };
}

export function statusOf(profile) {
  if (profile && profile.approved) return 'ok';
  if (profile && profile.profileDone) return 'wait';
  return 'todo';
}

function mountAccount(fb, user, profile, admin) {
  const el = document.getElementById('acct');
  if (!el) return;
  if (!user) {
    el.innerHTML = '<a class="btn btn-orange btn-sm" href="' + ROOT + 'login.html?next=' + encodeURIComponent(location.href) + '">Login / Sign up</a>';
    return;
  }
  const st = statusOf(profile);
  const label = { ok: 'Approved', wait: 'Pending approval', todo: 'Complete your profile' }[st];
  const bcls = { ok: 'done', wait: 'prog', todo: 'bad' }[st];
  const nm = (profile && profile.name) || user.name || 'Candidate';
  el.innerHTML =
    '<button class="avatar" id="avBtn" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">' + esc(initials(nm, user.email)) + '<span class="dot ' + (st === 'ok' ? 'ok' : '') + '"></span></button>' +
    '<div class="menu" id="menu" hidden>' +
      '<div class="menu-hd"><b>' + esc(nm) + '</b><span>' + esc(user.email) + '</span><em class="badge ' + bcls + '" style="font-style:normal">' + label + '</em></div>' +
      '<a href="' + ROOT + 'profile.html">My profile</a>' +
      '<a href="' + ROOT + 'profile.html#results">My results</a>' +
      (admin ? '<a href="' + ROOT + 'admin.html">Admin panel</a>' : '') +
      '<button class="out" id="logoutBtn">Log out</button>' +
    '</div>';
  const btn = document.getElementById('avBtn'), menu = document.getElementById('menu');
  btn.onclick = e => { e.stopPropagation(); const open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  document.addEventListener('click', e => { if (!el.contains(e.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
  document.getElementById('logoutBtn').onclick = async () => { await fb.logout(); location.href = ROOT + 'index.html'; };
}

// copy the user's online results into this device (so status shows on any device)
export async function seedLocal(fb, uid, testId) {
  try {
    const list = await fb.listResults(uid, testId);
    const by = {};
    list.forEach(r => { (by[r.testId] = by[r.testId] || []).push(r); });
    Object.keys(by).forEach(id => {
      const k = 'bts:' + uid + ':' + id + ':attempts';
      const cur = lget(k);
      if (!cur || !cur.length) lset(k, by[id].slice(0, 10));
    });
  } catch (e) {}
}

// results that could not be uploaded (offline) are retried later
const pk = uid => 'bts:pending:' + uid;
export function queueResult(uid, res) { const q = lget(pk(uid)) || []; q.push(res); lset(pk(uid), q); }
export async function flushPending(fb, uid) {
  const q = lget(pk(uid)) || [];
  if (!q.length) return;
  const rest = [];
  for (const r of q) { try { await fb.saveResult(uid, r); } catch (e) { rest.push(r); } }
  lset(pk(uid), rest);
}
