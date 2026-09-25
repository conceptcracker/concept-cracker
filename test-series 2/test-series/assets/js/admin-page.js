// Admin panel: approve candidates + upload protected questions
import { initPage } from './shell.js';
import { esc, friendlyError, fmtDate, fmtDateTime, r2 } from './core.js';
import { allTests } from './tests-config.js';

const $ = s => document.querySelector(s);
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.style.bottom = '30px'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
}

(async function main() {
  const { fb } = await initPage({ requireLogin: true, requireAdmin: true });

  /* ---------- tabs ---------- */
  const panes = { cand: $('#paneCand'), ques: $('#paneQues') };
  function tab(k) {
    Object.keys(panes).forEach(x => { panes[x].hidden = x !== k; $('#tab_' + x).classList.toggle('on', x === k); });
  }
  $('#tab_cand').onclick = () => tab('cand');
  $('#tab_ques').onclick = () => tab('ques');
  tab('cand');

  /* ---------- candidates ---------- */
  let users = [], filter = 'pending', search = '';
  async function loadUsers() {
    try { users = await fb.listUsers(); } catch (e) { $('#cList').innerHTML = '<p class="none">' + esc(friendlyError(e)) + '</p>'; return; }
    drawUsers();
  }
  function stateOf(u) { return u.approved ? 'approved' : (u.profileDone ? 'pending' : 'incomplete'); }
  function drawUsers() {
    const cnt = { pending: 0, approved: 0, incomplete: 0 };
    users.forEach(u => cnt[stateOf(u)]++);
    $('#cCount').innerHTML =
      '<div class="stat"><b>' + users.length + '</b><span>Total</span></div>' +
      '<div class="stat"><b style="color:#B45A0C">' + cnt.pending + '</b><span>Waiting for approval</span></div>' +
      '<div class="stat ok"><b>' + cnt.approved + '</b><span>Approved</span></div>' +
      '<div class="stat"><b>' + cnt.incomplete + '</b><span>Profile incomplete</span></div>';
    const defs = [['pending', 'Waiting (' + cnt.pending + ')'], ['approved', 'Approved (' + cnt.approved + ')'], ['incomplete', 'Incomplete (' + cnt.incomplete + ')'], ['all', 'All (' + users.length + ')']];
    $('#cFilters').innerHTML = defs.map(d => '<button data-f="' + d[0] + '" class="' + (d[0] === filter ? 'on' : '') + '">' + d[1] + '</button>').join('');
    $('#cFilters').querySelectorAll('button').forEach(b => { b.onclick = () => { filter = b.dataset.f; drawUsers(); }; });

    const q = search.toLowerCase();
    const rows = users
      .filter(u => (filter === 'all' || stateOf(u) === filter) && (!q || ((u.name || '') + ' ' + (u.email || '') + ' ' + (u.phone || '')).toLowerCase().indexOf(q) >= 0))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    $('#cList').innerHTML = rows.length ? rows.map(u => {
      const s = stateOf(u);
      const badge = s === 'approved' ? '<span class="badge done">Approved</span>' : s === 'pending' ? '<span class="badge prog">Waiting</span>' : '<span class="badge bad">Incomplete</span>';
      return '<div class="trow"><div><h4>' + esc(u.name || 'No name') + ' ' + badge + '</h4>' +
        '<div class="sub">' + esc(u.email || '') + (u.phone ? ' \u00b7 ' + esc(u.phone) : '') + (u.city ? ' \u00b7 ' + esc(u.city) : '') + '</div>' +
        '<div class="sub">' + esc(u.qualification || '') + (u.target ? (u.qualification ? ' \u00b7 ' : '') + esc(u.target) : '') + (u.createdAt ? ' \u00b7 joined ' + fmtDate(u.createdAt) : '') + '</div></div>' +
        '<div class="btns"><button class="btn btn-ghost btn-sm" data-r="' + u.uid + '">Results</button>' +
        (u.approved ? '<button class="btn btn-danger btn-sm" data-a="' + u.uid + '" data-v="0">Revoke</button>' : '<button class="btn btn-orange btn-sm" data-a="' + u.uid + '" data-v="1">Approve</button>') +
        '</div></div>';
    }).join('') : '<p class="none">No candidates in this list.</p>';

    $('#cList').querySelectorAll('[data-a]').forEach(b => { b.onclick = async () => {
      const uid = b.dataset.a, val = b.dataset.v === '1';
      b.setAttribute('disabled', '');
      try {
        await fb.setApproved(uid, val);
        const u = users.find(x => x.uid === uid); u.approved = val;
        toast(val ? 'Approved' : 'Access revoked');
        drawUsers();
      } catch (e) { toast(friendlyError(e)); b.removeAttribute('disabled'); }
    }; });
    $('#cList').querySelectorAll('[data-r]').forEach(b => { b.onclick = () => showResults(b.dataset.r); });
  }
  $('#cSearch').oninput = e => { search = e.target.value.trim(); drawUsers(); };

  async function showResults(uid) {
    const u = users.find(x => x.uid === uid) || {};
    const box = document.createElement('div'); box.className = 'modal';
    box.innerHTML = '<div class="box wide"><h3>' + esc(u.name || u.email || 'Candidate') + ' - results</h3><div id="rBody"><p class="none">Loading...</p></div><button class="btn btn-navy btn-block" id="rClose" style="margin-top:14px">Close</button></div>';
    document.body.appendChild(box);
    box.onclick = e => { if (e.target === box) box.remove(); };
    $('#rClose').onclick = () => box.remove();
    try {
      const list = await fb.listResults(uid);
      $('#rBody').innerHTML = list.length ? '<div class="rlist">' + list.map(r =>
        '<div class="ritem"><div><h4>' + esc(r.testName || r.testId) + '</h4><div class="sub">' + fmtDateTime(r.ts) + '</div></div>' +
        '<div class="sc">' + r2(r.score) + '<small> / ' + r.max + '</small></div>' +
        '<div class="mini"><span class="tag ok">' + r.correct + ' correct</span><span class="tag bad">' + r.wrong + ' wrong</span><span class="tag skip">' + r.skipped + ' skipped</span></div></div>').join('') + '</div>'
        : '<p class="none">No tests attempted yet.</p>';
    } catch (e) { $('#rBody').innerHTML = '<p class="none">' + esc(friendlyError(e)) + '</p>'; }
  }

  /* ---------- questions ---------- */
  const tests = allTests();
  let meta = {};
  async function loadMeta() {
    try { meta = await fb.getAllMeta(); } catch (e) { meta = {}; }
    drawTests();
  }
  $('#qSel').innerHTML = tests.map(t => '<option value="' + t.id + '">' + esc(t.name) + '</option>').join('');

  function drawTests() {
    $('#qList').innerHTML = tests.map(t => {
      const m = meta[t.id];
      return '<div class="trow"><div><h4>' + esc(t.name) + '</h4><div class="sub">' +
        (m ? m.n + ' questions \u00b7 ' + m.max + ' marks \u00b7 updated ' + fmtDate(m.updatedAt) : 'No questions uploaded yet') + ' (needs ' + t.group.expected + ')</div></div>' +
        '<div class="btns"><button class="btn btn-ghost btn-sm" data-u="' + t.id + '">' + (m ? 'Replace' : 'Upload') + '</button>' +
        (m ? '<button class="btn btn-danger btn-sm" data-d="' + t.id + '">Delete</button>' : '') + '</div></div>';
    }).join('');
    $('#qList').querySelectorAll('[data-u]').forEach(b => { b.onclick = () => { $('#qSel').value = b.dataset.u; resetCheck(); $('#upload').scrollIntoView({ behavior: 'smooth' }); }; });
    $('#qList').querySelectorAll('[data-d]').forEach(b => { b.onclick = async () => {
      const t = tests.find(x => x.id === b.dataset.d);
      if (!confirm('Delete all questions of "' + t.name + '"? Candidates will no longer be able to open it.')) return;
      try { await fb.deleteTest(t.id); toast('Deleted'); await loadMeta(); } catch (e) { toast(friendlyError(e)); }
    }; });
  }

  let checked = null;   // validated questions waiting to be published
  function resetCheck() { checked = null; $('#qReport').innerHTML = ''; $('#qPublish').setAttribute('disabled', ''); }
  $('#qText').oninput = resetCheck;
  $('#qSel').onchange = resetCheck;
  $('#qFile').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { $('#qText').value = r.result; resetCheck(); };
    r.readAsText(f);
  };

  function parse(text) {
    text = text.trim();
    if (!text) throw new Error('Paste the questions (or choose a file) first.');
    const body = text[0] === '['
      ? 'return (' + text.replace(/;\s*$/, '') + ');'
      : text + '\n;return (typeof qs !== "undefined") ? qs : null;';
    let v;
    try { v = new Function(body)(); } catch (e) { throw new Error('The file has a syntax error: ' + e.message); }
    if (!Array.isArray(v)) throw new Error('Could not find the questions array. The file must contain: var qs = [ ... ];');
    return v;
  }

  $('#qCheck').onclick = () => {
    const rep = $('#qReport'); rep.innerHTML = ''; checked = null; $('#qPublish').setAttribute('disabled', '');
    let list;
    try { list = parse($('#qText').value); } catch (e) { rep.innerHTML = '<div class="msg err">' + esc(e.message) + '</div>'; return; }
    const errs = [], out = [];
    list.forEach((x, i) => {
      const n = i + 1;
      if (!x || typeof x.q !== 'string' || !x.q.trim()) { errs.push('Question ' + n + ': question text (q) is missing.'); return; }
      if (!Array.isArray(x.o) || x.o.length < 2) { errs.push('Question ' + n + ': options (o) must be a list of at least 2.'); return; }
      if (!Number.isInteger(x.a) || x.a < 0 || x.a >= x.o.length) { errs.push('Question ' + n + ': correct answer (a) must be a number from 0 to ' + (x.o.length - 1) + '.'); return; }
      out.push({ q: x.q, o: x.o.map(String), a: x.a, m: typeof x.m === 'number' ? x.m : 3, n: typeof x.n === 'number' ? x.n : 1, img: x.img || '', exp: x.exp || '' });
    });
    const t = tests.find(z => z.id === $('#qSel').value);
    const max = out.reduce((a, q) => a + q.m, 0);
    let html = '<div class="vlist">';
    html += '<div class="' + (errs.length ? 'bad' : 'good') + '">' + out.length + ' valid question' + (out.length === 1 ? '' : 's') + ' found \u00b7 total ' + max + ' marks</div>';
    if (out.length !== t.group.expected) html += '<div>Note: ' + esc(t.name) + ' normally has ' + t.group.expected + ' questions. You can still publish.</div>';
    errs.slice(0, 15).forEach(e => { html += '<div class="bad">' + esc(e) + '</div>'; });
    if (errs.length > 15) html += '<div class="bad">...and ' + (errs.length - 15) + ' more problems.</div>';
    rep.innerHTML = html + '</div>';
    if (!errs.length && out.length) { checked = out; $('#qPublish').removeAttribute('disabled'); }
  };

  $('#qPublish').onclick = async () => {
    if (!checked) return;
    const t = tests.find(z => z.id === $('#qSel').value);
    if (meta[t.id] && !confirm('This will replace the existing questions of "' + t.name + '". Continue?')) return;
    const b = $('#qPublish'); b.setAttribute('disabled', '');
    try {
      await fb.putTest(t.id, checked, t.name);
      toast('Published: ' + t.name);
      $('#qText').value = ''; $('#qFile').value = ''; resetCheck();
      await loadMeta();
    } catch (e) { toast(friendlyError(e)); b.removeAttribute('disabled'); }
  };

  await Promise.all([loadUsers(), loadMeta()]);
})().catch(e => console.error(e));
