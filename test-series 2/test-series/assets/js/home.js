// Home page: account icon, call-to-action and progress bars
import { initPage, seedLocal, statusOf } from './shell.js';
import { ROOT, lk, lget } from './core.js';

(async function main() {
  const { fb, user, profile } = await initPage({});
  const cta = document.getElementById('cta');
  if (!user) {
    cta.innerHTML = '<a class="btn btn-orange" href="' + ROOT + 'login.html">Login / Create account</a>';
  } else {
    const st = statusOf(profile);
    const msg = { ok: '<span class="fact"><b>Approved</b> &middot; you can take tests</span>', wait: '<span class="fact"><b>Pending</b> &middot; waiting for admin approval</span>', todo: '<span class="fact"><b>Almost there</b> &middot; complete your profile</span>' }[st];
    cta.innerHTML = '<a class="btn btn-orange" href="' + ROOT + (st === 'todo' ? 'profile.html?first=1' : 'profile.html') + '">' + (st === 'todo' ? 'Complete profile' : 'My profile & results') + '</a>' + msg;
    if (st === 'ok') await seedLocal(fb, user.uid);
  }
  document.querySelectorAll('.folder').forEach(f => {
    const p = f.dataset.p, n = +f.dataset.n; let done = 0;
    for (let i = 1; i <= n; i++) { const a = lget(lk(p + i, 'attempts')); if (a && a.length) done++; }
    f.querySelector('.bar i').style.width = (done / n * 100) + '%';
    f.querySelector('.prog').textContent = done + ' of ' + n + ' attempted';
  });
})().catch(e => console.error(e));
