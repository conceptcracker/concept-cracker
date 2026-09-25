/* ==========================================================
   Test engine - Assistant Professor Test Series
   Reads: window.TEST  (id, name, duration, sections, backUrl)
          window.qs    (array of questions: q, o, a, m, n, img, exp)
          window.BTS_UID        (logged-in user id, used to keep progress per user)
          window.BTS_onFinish   (optional hook, called with the result when a test is submitted)
   ========================================================== */
(function () {
  'use strict';

  var T = window.TEST || {};
  var Q = (window.qs || []).slice();
  var N = Q.length;
  var UID = window.BTS_UID || '';
  var KEY = 'bts:' + (UID ? UID + ':' : '') + T.id;
  var app = document.getElementById('app');
  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  var S = null;          // live test state
  var tick = null;       // timer interval

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function get(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function clock(sec) { sec = Math.max(0, sec); return pad(Math.floor(sec / 3600)) + ':' + pad(Math.floor(sec % 3600 / 60)) + ':' + pad(sec % 60); }
  function dur(sec) { return Math.floor(sec / 60) + ' min ' + pad(sec % 60) + ' sec'; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mk(q) { return q.m == null ? 3 : q.m; }
  function ng(q) { return q.n == null ? 1 : q.n; }
  function isAns(v) { return v != null && v >= 0; }

  function typeset(node) {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(node || app, {
          delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
          throwOnError: false
        });
      } catch (e) {}
    }
  }
  // KaTeX loads with "defer"; keep trying for a few seconds until it is ready
  (function waitKatex(n) {
    if (window.renderMathInElement) { typeset(app); return; }
    if (n < 40) setTimeout(function () { waitKatex(n + 1); }, 250);
  })(0);

  function toast(msg) {
    var old = $('.toast'); if (old) old.remove();
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  /* ---------- sections ---------- */
  var secs = (function () {
    var defs = (T.sections && T.sections.length) ? T.sections : [{ name: 'Questions', count: N }];
    var out = [], idx = 0;
    defs.forEach(function (d, i) {
      var cnt = (i === defs.length - 1) ? Math.max(0, N - idx) : Math.min(d.count, N - idx);
      out.push({ name: d.name, start: idx, end: idx + cnt });
      idx += cnt;
    });
    return out.filter(function (s) { return s.end > s.start; });
  })();
  function secOf(i) { for (var k = 0; k < secs.length; k++) if (i >= secs[k].start && i < secs[k].end) return k; return 0; }

  var MAX = Q.reduce(function (a, q) { return a + mk(q); }, 0);
  var MARK_TXT = N ? ('+' + mk(Q[0]) + ' for correct, \u2212' + ng(Q[0]) + ' for wrong') : '';

  /* ---------- evaluation ---------- */
  function evaluate(ans) {
    var r = { score: 0, max: 0, correct: 0, wrong: 0, skipped: 0, secs: [] };
    secs.forEach(function (sec) {
      var s = { name: sec.name, count: sec.end - sec.start, correct: 0, wrong: 0, skipped: 0, score: 0, max: 0 };
      for (var i = sec.start; i < sec.end; i++) {
        var q = Q[i]; s.max += mk(q);
        if (!isAns(ans[i])) s.skipped++;
        else if (ans[i] === q.a) { s.correct++; s.score += mk(q); }
        else { s.wrong++; s.score -= ng(q); }
      }
      s.score = r2(s.score);
      r.correct += s.correct; r.wrong += s.wrong; r.skipped += s.skipped; r.score += s.score; r.max += s.max;
      r.secs.push(s);
    });
    r.score = r2(r.score);
    return r;
  }

  /* ---------- state ---------- */
  function persist() { if (S) set(KEY + ':state', S); }
  function status(i) {
    var a = isAns(S.ans[i]), m = S.mark[i];
    if (a && m) return 'am'; if (m) return 'm'; if (a) return 'a'; if (S.vis[i]) return 'n'; return 'u';
  }
  function newState() {
    var now = Date.now(), z = function (v) { var a = []; for (var i = 0; i < N; i++) a.push(v); return a; };
    var s = { startTs: now, endTs: now + T.duration * 60000, cur: 0, ans: z(-1), mark: z(false), vis: z(false) };
    s.vis[0] = true; return s;
  }

  /* ==========================================================
     SCREENS
     ========================================================== */
  function backLink() { return '<a class="back" href="' + (T.backUrl || 'index.html') + '">\u2190 All tests</a>'; }

  /* ---------- intro ---------- */
  function showIntro(notice) {
    clearInterval(tick);
    window.scrollTo(0, 0);
    if (!N) {
      app.innerHTML = '<div class="shell">' + backLink() +
        '<div class="empty"><h2>' + esc(T.name) + '</h2><p>Questions for this test have not been added yet. Please check back soon.</p>' +
        '<a class="btn btn-navy" href="' + (T.backUrl || 'index.html') + '">Back to all tests</a></div></div>';
      return;
    }
    var atts = get(KEY + ':attempts') || [];
    var saved = get(KEY + ':state');
    var left = saved ? Math.round((saved.endTs - Date.now()) / 1000) : 0;
    var secHtml = secs.length > 1 ? '<div class="secs">' + secs.map(function (s) {
      return '<span class="chip"><b>' + (s.end - s.start) + '</b> ' + esc(s.name) + '</span>';
    }).join('') + '</div>' : '';

    var acts = '';
    if (saved && left > 0) {
      acts += '<button class="btn btn-orange btn-block" id="resume">Resume test (' + clock(left) + ' left)</button>' +
              '<button class="btn btn-ghost btn-block" id="restart">Discard progress and start again</button>';
    } else {
      acts += '<button class="btn btn-orange btn-block" id="start">Start test</button>';
    }
    if (atts.length) acts += '<button class="btn btn-ghost btn-block" id="last">View last result (' + r2(atts[0].score) + ' / ' + atts[0].max + ')</button>';

    app.innerHTML = '<div class="shell">' + backLink() +
      (notice ? '<div class="notice">' + notice + '</div>' : '') +
      '<div class="intro"><div class="intro-hd"><h1>' + esc(T.name) + '</h1><p>Read the instructions, then start when you are ready.</p></div>' +
      '<div class="kv"><div><b>' + N + '</b><span>Questions</span></div><div><b>' + T.duration + '</b><span>Minutes</span></div>' +
      '<div><b>' + MAX + '</b><span>Total marks</span></div><div><b>+' + mk(Q[0]) + ' / \u2212' + ng(Q[0]) + '</b><span>Marking</span></div></div>' +
      '<div class="intro-bd">' + secHtml + '<h3>Instructions</h3><ul>' +
      '<li>' + MARK_TXT + '. Unanswered questions carry no marks.</li>' +
      '<li>The timer starts when you tap Start and cannot be paused.</li>' +
      '<li>Tap an option to answer. Use Clear to remove your answer.</li>' +
      '<li>Mark for review flags a question for later. It is still evaluated if you have answered it.</li>' +
      (secs.length > 1 ? '<li>You can move between sections at any time.</li>' : '') +
      '<li>Your progress is saved on this device, so a page refresh will not reset the test.</li>' +
      '<li>The test is submitted automatically when time runs out.</li></ul></div>' +
      '<div class="intro-act">' + acts + '</div></div></div>';

    var b;
    if ((b = $('#start'))) b.onclick = startTest;
    if ((b = $('#resume'))) b.onclick = function () { S = saved; renderTest(); };
    if ((b = $('#restart'))) b.onclick = function () { if (confirm('Discard your saved progress and start a fresh attempt?')) startTest(); };
    if ((b = $('#last'))) b.onclick = function () { showResult(atts[0]); };
  }

  function startTest() { S = newState(); persist(); renderTest(); }

  /* ---------- live test ---------- */
  function renderTest() {
    window.scrollTo(0, 0);
    app.innerHTML =
      '<header class="tb"><div class="l"><button class="icon-btn pal-toggle" id="palBtn" aria-label="Question palette">\u2630</button>' +
      '<span class="ttl">' + esc(T.name) + '</span></div>' +
      '<div class="timer" id="timer">--:--:--</div>' +
      '<button class="btn btn-orange btn-sm" id="submitBtn">Submit</button></header>' +
      (secs.length > 1 ? '<nav class="sec-tabs" id="tabs"></nav>' : '') +
      '<div class="test-body"><main class="qpane" id="qpane"></main><aside class="palette" id="palette"></aside></div>' +
      '<div class="scrim" id="scrim"></div>' +
      '<footer class="qbar"><div class="in">' +
      '<button class="btn btn-ghost" id="prev">Previous</button>' +
      '<button class="btn btn-ghost" id="clear">Clear</button>' +
      '<button class="btn btn-ghost btn-rev" id="rev">Review</button>' +
      '<button class="btn btn-navy" id="next">Save &amp; Next</button></div></footer>';

    $('#prev').onclick = function () { if (S.cur > 0) goTo(S.cur - 1); else toast('This is the first question'); };
    $('#next').onclick = function () { if (S.cur < N - 1) goTo(S.cur + 1); else toast('Last question. Tap Submit when you are done.'); };
    $('#clear').onclick = function () { S.ans[S.cur] = -1; persist(); renderQ(); renderPalette(); };
    $('#rev').onclick = function () { S.mark[S.cur] = !S.mark[S.cur]; persist(); renderQ(); renderPalette(); toast(S.mark[S.cur] ? 'Marked for review' : 'Review mark removed'); };
    $('#submitBtn').onclick = confirmSubmit;
    $('#palBtn').onclick = function () { togglePalette(true); };
    $('#scrim').onclick = function () { togglePalette(false); };

    renderTabs(); renderQ(); renderPalette(); startTimer();
  }

  function togglePalette(open) {
    var p = $('#palette'), sc = $('#scrim');
    if (!p) return;
    p.classList.toggle('open', open); sc.classList.toggle('on', open);
  }

  function goTo(i) {
    S.cur = i; S.vis[i] = true; persist();
    renderTabs(); renderQ(); renderPalette(); togglePalette(false);
    window.scrollTo(0, 0);
  }

  function renderTabs() {
    var t = $('#tabs'); if (!t) return;
    var cs = secOf(S.cur);
    t.innerHTML = secs.map(function (s, k) {
      return '<button data-k="' + k + '" class="' + (k === cs ? 'on' : '') + '">' + esc(s.name) + ' (' + (s.end - s.start) + ')</button>';
    }).join('');
    $$('button', t).forEach(function (b) { b.onclick = function () { goTo(secs[+b.getAttribute('data-k')].start); }; });
  }

  function renderQ() {
    var i = S.cur, q = Q[i], sel = S.ans[i];
    var html = '<div class="q-head"><span class="q-num">Question ' + (i + 1) + '</span>' +
      (secs.length > 1 ? '<span class="tag">' + esc(secs[secOf(i)].name) + '</span>' : '') +
      '<span class="tag mk">+' + mk(q) + ' / \u2212' + ng(q) + '</span>' +
      (S.mark[i] ? '<span class="tag rv">Marked for review</span>' : '') + '</div>' +
      '<div class="q-text">' + q.q + '</div>' +
      (q.img ? '<img class="q-img" src="' + esc(q.img) + '" alt="Question figure">' : '') +
      '<div class="opts">' + q.o.map(function (o, k) {
        return '<button class="opt' + (sel === k ? ' sel' : '') + '" data-k="' + k + '"><span class="l">' + LETTERS[k] + '</span><span class="t">' + o + '</span></button>';
      }).join('') + '</div>';
    var pane = $('#qpane'); pane.innerHTML = html;
    $$('.opt', pane).forEach(function (b) {
      b.onclick = function () { S.ans[i] = +b.getAttribute('data-k'); persist(); renderQ(); renderPalette(); };
    });
    var rv = $('#rev'); if (rv) { rv.classList.toggle('on', !!S.mark[i]); rv.textContent = S.mark[i] ? 'Unmark' : 'Review'; }
    var nx = $('#next'); if (nx) nx.innerHTML = (i === N - 1) ? 'Save' : 'Save &amp; Next';
    typeset(pane);
  }

  function renderPalette() {
    var p = $('#palette'), c = { a: 0, n: 0, m: 0, u: 0 };
    for (var i = 0; i < N; i++) { var s = status(i); if (s === 'a') c.a++; else if (s === 'n') c.n++; else if (s === 'm' || s === 'am') c.m++; else c.u++; }
    var html = '<div class="pal-hd"><h3>Question palette</h3><button class="x" id="palX" aria-label="Close">\u2715</button></div>' +
      '<div class="legend"><span><i class="a"></i>Answered ' + c.a + '</span><span><i class="n"></i>Not answered ' + c.n + '</span>' +
      '<span><i class="m"></i>For review ' + c.m + '</span><span><i></i>Not visited ' + c.u + '</span></div>';
    secs.forEach(function (sec) {
      html += (secs.length > 1 ? '<div class="pal-sec">' + esc(sec.name) + '</div>' : '') + '<div class="pgrid">';
      for (var j = sec.start; j < sec.end; j++) {
        html += '<button class="pb ' + status(j) + (j === S.cur ? ' cur' : '') + '" data-i="' + j + '">' + (j + 1) + '</button>';
      }
      html += '</div>';
    });
    p.innerHTML = html;
    $$('.pb', p).forEach(function (b) { b.onclick = function () { goTo(+b.getAttribute('data-i')); }; });
    $('#palX').onclick = function () { togglePalette(false); };
  }

  function startTimer() {
    clearInterval(tick);
    function upd() {
      if (!S) return;
      var left = Math.round((S.endTs - Date.now()) / 1000);
      var t = $('#timer');
      if (t) { t.textContent = clock(left); t.classList.toggle('low', left <= 300); }
      if (left <= 0) { finish(true); }
    }
    upd();
    if (S) tick = setInterval(upd, 1000);
  }

  function confirmSubmit() {
    var a = 0, m = 0;
    for (var i = 0; i < N; i++) { var s = status(i); if (s === 'a' || s === 'am') a++; if (S.mark[i]) m++; }
    var box = document.createElement('div'); box.className = 'modal';
    box.innerHTML = '<div class="box"><h3>Submit test?</h3><div class="mgrid">' +
      '<div><b>' + a + '</b><span>Answered</span></div><div><b>' + (N - a) + '</b><span>Not answered</span></div>' +
      '<div><b>' + m + '</b><span>Marked for review</span></div><div><b>' + clock(Math.round((S.endTs - Date.now()) / 1000)) + '</b><span>Time left</span></div></div>' +
      '<div class="acts"><button class="btn btn-ghost" id="mNo">Keep going</button><button class="btn btn-orange" id="mYes">Submit</button></div></div>';
    document.body.appendChild(box);
    $('#mNo', box).onclick = function () { box.remove(); };
    $('#mYes', box).onclick = function () { box.remove(); finish(false); };
  }

  function finish(auto) {
    clearInterval(tick);
    if (!S) return;
    var now = Date.now();
    var res = evaluate(S.ans);
    res.ts = now; res.qn = N; res.ans = S.ans.slice(); res.mark = S.mark.slice();
    res.used = Math.max(0, Math.round((Math.min(now, S.endTs) - S.startTs) / 1000));
    res.auto = !!auto;
    var atts = get(KEY + ':attempts') || [];
    atts.unshift(res); set(KEY + ':attempts', atts.slice(0, 10));
    del(KEY + ':state'); S = null;
    try { if (typeof window.BTS_onFinish === 'function') window.BTS_onFinish(res); } catch (e) {}
    showResult(res);
  }

  /* ---------- result ---------- */
  function showResult(res) {
    clearInterval(tick);
    var oldT = $('.toast'); if (oldT) oldT.remove();
    window.scrollTo(0, 0);
    var attempted = res.correct + res.wrong;
    var acc = attempted ? Math.round(res.correct / attempted * 100) : 0;
    var pct = res.max ? r2(res.score / res.max * 100) : 0;
    var canReview = res.qn === N;

    var secRows = res.secs.map(function (s) {
      return '<tr><td>' + esc(s.name) + '</td><td>' + s.correct + '</td><td>' + s.wrong + '</td><td>' + s.skipped + '</td><td><b>' + s.score + '</b> / ' + s.max + '</td></tr>';
    }).join('');

    app.innerHTML = '<div class="shell">' + backLink() +
      (res.auto ? '<div class="notice">Time was up, so your test was submitted automatically.</div>' : '') +
      '<div class="res-hero"><div class="name">' + esc(T.name) + '</div>' +
      '<div class="score">' + res.score + '<small> / ' + res.max + '</small></div>' +
      '<span class="pct">' + pct + '%</span></div>' +
      '<div class="stats">' +
      '<div class="stat ok"><b>' + res.correct + '</b><span>Correct</span></div>' +
      '<div class="stat bad"><b>' + res.wrong + '</b><span>Wrong</span></div>' +
      '<div class="stat"><b>' + res.skipped + '</b><span>Skipped</span></div>' +
      '<div class="stat"><b>' + acc + '%</b><span>Accuracy</span></div></div>' +
      '<div class="card"><h3>Section-wise performance</h3><div class="tbl-wrap"><table><thead><tr><th>Section</th><th>Correct</th><th>Wrong</th><th>Skipped</th><th>Score</th></tr></thead><tbody>' + secRows + '</tbody></table></div>' +
      '<p style="margin-top:10px;font-size:14px;color:var(--muted)">Time taken: <b>' + dur(res.used) + '</b> of ' + T.duration + ' min</p></div>' +
      '<div class="res-act">' +
      (canReview ? '<a class="btn btn-navy" href="#solutions" id="toSol">View solutions</a>' : '') +
      '<button class="btn btn-orange" id="retake">Retake test</button>' +
      '<a class="btn btn-ghost" href="' + (T.backUrl || 'index.html') + '">All tests</a></div>' +
      (canReview ? '<div id="solutions" style="margin-top:26px"><h3 style="font-family:var(--f-head);font-size:20px">Solutions</h3>' +
        '<div class="filters" id="filters"></div><div id="sollist"></div></div>' :
        '<p class="none">Detailed solutions are not available because the questions were updated after this attempt.</p>') +
      '</div>';

    $('#retake').onclick = function () { if (confirm('Start a fresh attempt?')) startTest(); };
    if (canReview) buildSolutions(res);
  }

  function qState(res, i) {
    var v = res.ans[i];
    if (!isAns(v)) return 'skip';
    return v === Q[i].a ? 'ok' : 'bad';
  }

  function buildSolutions(res) {
    var counts = { all: N, ok: 0, bad: 0, skip: 0 };
    for (var i = 0; i < N; i++) counts[qState(res, i)]++;
    var cur = 'all';
    var defs = [['all', 'All'], ['ok', 'Correct'], ['bad', 'Wrong'], ['skip', 'Skipped']];
    var fbox = $('#filters'), list = $('#sollist');

    function draw() {
      fbox.innerHTML = defs.map(function (d) {
        return '<button data-f="' + d[0] + '" class="' + (d[0] === cur ? 'on' : '') + '">' + d[1] + ' (' + counts[d[0]] + ')</button>';
      }).join('');
      $$('button', fbox).forEach(function (b) { b.onclick = function () { cur = b.getAttribute('data-f'); draw(); }; });

      var html = '';
      for (var i = 0; i < N; i++) {
        var st = qState(res, i);
        if (cur !== 'all' && st !== cur) continue;
        var q = Q[i], yours = res.ans[i];
        var label = st === 'ok' ? '<span class="tag ok">Correct +' + mk(q) + '</span>' :
                    st === 'bad' ? '<span class="tag bad">Wrong \u2212' + ng(q) + '</span>' : '<span class="tag skip">Skipped</span>';
        html += '<article class="sol"><div class="q-head"><span class="q-num">Question ' + (i + 1) + '</span>' +
          (secs.length > 1 ? '<span class="tag">' + esc(secs[secOf(i)].name) + '</span>' : '') + label +
          (res.mark && res.mark[i] ? '<span class="tag rv">Marked</span>' : '') + '</div>' +
          '<div class="q-text">' + q.q + '</div>' +
          (q.img ? '<img class="q-img" src="' + esc(q.img) + '" alt="Question figure">' : '') +
          '<div class="opts">' + q.o.map(function (o, k) {
            var cls = k === q.a ? ' right' : (k === yours ? ' wrong' : '');
            var note = k === q.a ? (k === yours ? 'Your answer \u2713' : 'Correct answer') : (k === yours ? 'Your answer' : '');
            return '<div class="sopt' + cls + '"><span class="l">' + LETTERS[k] + '</span><span>' + o + '</span>' + (note ? '<span class="note">' + note + '</span>' : '') + '</div>';
          }).join('') + '</div>' +
          (q.exp ? '<div class="exp"><b>Explanation.</b> ' + q.exp + '</div>' : '') + '</article>';
      }
      list.innerHTML = html || '<p class="none">No questions in this category.</p>';
      typeset(list);
    }
    draw();
  }

  /* ---------- init ---------- */
  (function init() {
    if (!app) return;
    if (N) {
      var saved = get(KEY + ':state');
      if (saved && saved.ans && saved.ans.length === N && saved.endTs <= Date.now()) {
        S = saved; finish(true); return;
      }
      if (saved && (!saved.ans || saved.ans.length !== N)) del(KEY + ':state');
    }
    showIntro();
  })();
})();
