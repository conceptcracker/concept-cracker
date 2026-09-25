// Candidate profile + results section
import { initPage, statusOf } from './shell.js';
import { ROOT, esc, qp, safeNext, friendlyError, fmtDate, fmtDateTime, fmtDur, r2 } from './core.js';

const $ = s => document.querySelector(s);

(async function main() {
  const { fb, user, profile } = await initPage({ requireLogin: true });
  let prof = profile || {};
  const first = qp('first') === '1';

  renderStatus(prof);

  // ---- form ----
  $('#pEmail').value = user.email || prof.email || '';
  $('#pName').value = prof.name || user.name || '';
  $('#pPhone').value = prof.phone || '';
  $('#pCity').value = prof.city || '';
  $('#pQual').value = prof.qualification || '';
  $('#pTarget').value = prof.target || 'Assistant Professor (Physics)';
  if (first && !prof.profileDone) $('#firstNote').hidden = false;

  $('#pForm').onsubmit = async e => {
    e.preventDefault();
    const msg = $('#pMsg'); msg.hidden = true;
    const data = {
      name: $('#pName').value.trim(), phone: $('#pPhone').value.trim(), city: $('#pCity').value.trim(),
      qualification: $('#pQual').value, target: $('#pTarget').value.trim()
    };
    if (!data.name) return say('Please enter your full name.', 'err');
    if (!/^[0-9+\-\s]{10,15}$/.test(data.phone)) return say('Please enter a valid mobile number (10 digits).', 'err');
    data.profileDone = true;
    const btn = $('#pSave'); btn.setAttribute('disabled', '');
    try {
      await fb.saveProfile(user.uid, data);
      prof = Object.assign({}, prof, data);
      renderStatus(prof);
      $('#firstNote').hidden = true;
      say('Profile saved.', 'okk');
      const next = safeNext(qp('next'));
      if (first && next) setTimeout(() => location.replace(next), 700);
    } catch (err) { say(friendlyError(err), 'err'); }
    finally { btn.removeAttribute('disabled'); }
  };
  function say(t, type) { const m = $('#pMsg'); m.className = 'msg ' + type; m.textContent = t; m.hidden = false; }

  $('#logout').onclick = async () => { await fb.logout(); location.href = ROOT + 'index.html'; };

  // ---- results ----
  let all = [];
  try { all = await fb.listResults(user.uid); } catch (e) {}
  renderResults(all);
  if (location.hash === '#results') { const r = document.getElementById('results'); if (r) r.scrollIntoView(); }
})().catch(e => console.error(e));

function renderStatus(p) {
  const st = statusOf(p);
  const c = {
    ok: ['ok', 'Approved', 'You can take all tests.'],
    wait: ['wait', 'Waiting for approval', 'Your details are with the admin. You will be able to take tests once approved.'],
    todo: ['todo', 'Complete your profile', 'Fill in the form below so the admin knows who you are.']
  }[st];
  $('#status').className = 'status-card ' + c[0];
  $('#status').innerHTML = '<div><b>' + c[1] + '</b>' + c[2] + '</div>';
}

function renderResults(all) {
  const sumBox = $('#resSum'), fBox = $('#resFilters'), list = $('#resList');
  if (!all.length) {
    sumBox.innerHTML = '';
    fBox.innerHTML = '';
    list.innerHTML = '<div class="empty"><h2>No results yet</h2><p>Your scores will appear here after you submit a test.</p><a class="btn btn-orange" href="' + ROOT + 'index.html">Browse tests</a></div>';
    return;
  }
  const pct = r => (r.max ? r.score / r.max * 100 : 0);
  const tests = new Set(all.map(r => r.testId)).size;
  const best = Math.max.apply(null, all.map(pct));
  const avg = all.reduce((a, r) => a + pct(r), 0) / all.length;
  sumBox.innerHTML =
    '<div class="stat"><b>' + all.length + '</b><span>Attempts</span></div>' +
    '<div class="stat"><b>' + tests + '</b><span>Different tests</span></div>' +
    '<div class="stat ok"><b>' + r2(best) + '%</b><span>Best score</span></div>' +
    '<div class="stat"><b>' + r2(avg) + '%</b><span>Average score</span></div>';

  const groups = ['All'].concat(Array.from(new Set(all.map(r => r.group).filter(Boolean))));
  let cur = 'All';
  function draw() {
    fBox.innerHTML = groups.map(g => '<button class="' + (g === cur ? 'on' : '') + '" data-g="' + esc(g) + '">' + esc(g) + '</button>').join('');
    fBox.querySelectorAll('button').forEach(b => { b.onclick = () => { cur = b.dataset.g; draw(); }; });
    list.innerHTML = all.filter(r => cur === 'All' || r.group === cur).map(r =>
      '<div class="ritem"><div><h4>' + esc(r.testName || r.testId) + '</h4><div class="sub">' + fmtDateTime(r.ts) + '</div></div>' +
      '<div class="sc">' + r2(r.score) + '<small> / ' + r.max + '</small></div>' +
      '<div class="mini"><span class="tag ok">' + r.correct + ' correct</span><span class="tag bad">' + r.wrong + ' wrong</span><span class="tag skip">' + r.skipped + ' skipped</span>' +
      '<span class="tag">' + fmtDur(r.used || 0) + '</span>' + (r.page ? '<a href="' + ROOT + esc(r.page) + '">Open test</a>' : '') + '</div></div>'
    ).join('');
  }
  draw();
}
