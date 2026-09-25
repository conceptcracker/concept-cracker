// Test list page (Full Length / General Study / Physics)
import { initPage, seedLocal, statusOf } from './shell.js';
import { ROOT, lk, lget, r2 } from './core.js';
import { GROUPS } from './tests-config.js';

const g = GROUPS.find(x => x.prefix === (window.LIST || {}).prefix);
const grid = document.getElementById('grid');
const bannerBox = document.getElementById('banner');

(async function main() {
  const { fb, user, profile } = await initPage({ requireLogin: true });
  const st = statusOf(profile);

  if (st === 'todo') {
    bannerBox.innerHTML = '<div class="in"><span><b>Complete your profile.</b> Add a few details so the admin can approve your account.</span>' +
      '<a class="btn btn-orange btn-sm" href="' + ROOT + 'profile.html?first=1&next=' + encodeURIComponent(location.href) + '">Complete profile</a></div>';
  } else if (st === 'wait') {
    bannerBox.innerHTML = '<div class="in"><span><b>Waiting for approval.</b> You can start tests as soon as the admin approves your account.</span></div>';
  }

  let meta = {};
  try { meta = await fb.getAllMeta(); } catch (e) {}
  if (st === 'ok') await seedLocal(fb, user.uid);

  let html = '';
  for (let i = 1; i <= g.count; i++) html += card(i, st === 'ok', meta[g.prefix + i]);
  grid.innerHTML = html;
})().catch(e => console.error(e));

function card(i, approved, m) {
  const id = g.prefix + i;
  const atts = lget(lk(id, 'attempts')) || [];
  const saved = lget(lk(id, 'state'));
  const inProg = saved && saved.endTs > Date.now();
  const n = m ? m.n : 0;
  const ready = n > 0;

  let badge, btn, best = '';
  if (!ready) {
    badge = '<span class="badge soon">Coming soon</span>';
    btn = '<span class="btn btn-ghost btn-block disabled">Not available yet</span>';
  } else if (!approved) {
    badge = '<span class="badge soon">Locked</span>';
    btn = '<span class="btn btn-ghost btn-block disabled">Locked until approved</span>';
  } else if (inProg) {
    badge = '<span class="badge prog">In progress</span>';
    btn = '<a class="btn btn-orange btn-block" href="test' + i + '.html">Resume test</a>';
  } else if (atts.length) {
    const top = atts.reduce((a, b) => (b.score > a.score ? b : a), atts[0]);
    badge = '<span class="badge done">Attempted</span>';
    best = '<div class="best">Best: ' + r2(top.score) + ' / ' + top.max + ' \u00b7 ' + atts.length + ' attempt' + (atts.length > 1 ? 's' : '') + '</div>';
    btn = '<a class="btn btn-navy btn-block" href="test' + i + '.html">View / retake</a>';
  } else {
    badge = '<span class="badge">Not attempted</span>';
    btn = '<a class="btn btn-orange btn-block" href="test' + i + '.html">Start test</a>';
  }
  const qtxt = ready ? (n + (n < g.expected ? ' of ' + g.expected : '') + ' questions') : g.expected + ' questions';
  return '<article class="tcard"><div class="top"><h3>' + g.label + ' ' + i + '</h3>' + badge + '</div>' +
    '<p class="meta">' + qtxt + ' \u00b7 ' + g.duration + ' min' + (ready ? ' \u00b7 ' + m.max + ' marks' : '') + '</p>' + best + btn + '</article>';
}
