/* barc/test-engine.js - Master Engine */

var cQ = 0, uA = [], qS = [], tInt;

// --- Anti-Cheat Proctoring ---
document.addEventListener('contextmenu', e => e.preventDefault());
let warnings = 0;
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden' && document.getElementById('test').style.display === 'flex') {
        warnings++;
        if (warnings >= 3) { 
            alert("Security Violation: You switched tabs 3 times. Test is Auto-Submitting!"); 
            finalSubmit(true); 
        } else { 
            alert("Warning " + warnings + "/3: Do not switch tabs during the exam!"); 
        }
    }
});

// --- Initialization ---
function iT() {
    var p = document.getElementById('pal');
    for (var i = 0; i < qs.length; i++) {
        var b = document.createElement('div');
        b.className = 'bub unseen'; 
        b.id = 'b-' + i; 
        b.innerText = i + 1;
        (function(idx) { b.onclick = function() { lQ(idx); }; })(i);
        p.appendChild(b);
        uA.push(null); 
        qS.push('unseen');
    }
    lQ(0);
}

// --- Load Question ---
function lQ(i) {
    if (qS[cQ] === 'unseen') uS(cQ, 'n-ans'); 
    cQ = i; 
    var q = qs[i];
    
    document.getElementById('qn').innerText = cQ + 1;
    document.getElementById('qm').innerText = q.m;
    document.getElementById('qn-m').innerText = "-" + q.n;
    document.getElementById('qt').innerHTML = q.q;
    
    var imgHtml = (q.img && q.img !== "") ? "<img src='" + q.img + "' style='max-width:100%; margin-top:15px; border-radius:5px;'>" : "";
    document.getElementById('qi').innerHTML = imgHtml;
    
    var oH = '';
    for (var j = 0; j < q.o.length; j++) {
        var ch = (uA[cQ] === j) ? 'checked' : '';
        oH += "<li><label><input type='radio' name='opt' value='" + j + "' " + ch + "> " + q.o[j] + "</label></li>";
    }
    document.getElementById('ol').innerHTML = oH;
    
    setTimeout(() => { if (window.MathJax) { MathJax.typesetClear(); MathJax.typeset(); } }, 100);
}

// --- Status & Buttons ---
function uS(i, s) {
    qS[i] = s;
    var b = document.getElementById('b-' + i);
    if (b) b.className = 'bub ' + s;
}

function getSelected() {
    var ops = document.getElementsByName('opt');
    for (var i = 0; i < ops.length; i++) { if (ops[i].checked) return parseInt(ops[i].value); }
    return null;
}

function sav() {
    var sel = getSelected();
    if (sel !== null) { uA[cQ] = sel; uS(cQ, 'ans'); } else { uS(cQ, 'n-ans'); }
    if (cQ < qs.length - 1) lQ(cQ + 1);
}

function rev() {
    var sel = getSelected();
    uA[cQ] = sel; 
    if (sel !== null) { uS(cQ, 'rev-ans'); } else { uS(cQ, 'rev'); }
    if (cQ < qs.length - 1) lQ(cQ + 1);
}

function clr() {
    uA[cQ] = null;
    var ops = document.getElementsByName('opt');
    for (var i = 0; i < ops.length; i++) ops[i].checked = false;
    uS(cQ, 'n-ans');
}

// --- Timer ---
function sT(d) {
    var t = d, m, s, h;
    tInt = setInterval(function() {
        h = parseInt(t / 3600, 10);
        m = parseInt((t % 3600) / 60, 10); 
        s = parseInt(t % 60, 10);
        h = h < 10 ? "0" + h : h; m = m < 10 ? "0" + m : m; s = s < 10 ? "0" + s : s;
        document.getElementById('time').innerText = (h > 0 ? h + ":" : "") + m + ":" + s;
        if (--t < 0) { clearInterval(tInt); alert("Time is up! Submitting test..."); finalSubmit(true); }
    }, 1000);
}

// --- Final Submit & Save to Unified Profile ---
// --- Final Submit & Save to BARC Results ---
function finalSubmit(force) {
    if (!force && !confirm("Are you sure you want to submit the exam?")) return;
    clearInterval(tInt);
    
    document.getElementById('test-header').style.display = 'none';
    document.getElementById('test').style.display = 'none';
    document.getElementById('res').style.display = 'block';
    
    var sc = 0, c = 0, w = 0, u = 0, ms = 0;
    
    for (var i = 0; i < qs.length; i++) {
        ms += qs[i].m; 
        if (uA[i] === null) { u++; } 
        else {
            if (uA[i] === qs[i].a) { sc += qs[i].m; c++; }
            else { sc -= qs[i].n; w++; }
        }
    }
    
    var acc = (c + w > 0) ? (c / (c + w) * 100) : 0;

    // Screen par turant result dikhana
    document.getElementById('f-sc').innerText = sc.toFixed(2);
    document.getElementById('m-sc').innerText = ms;
    document.getElementById('rc-c').innerText = c;
    document.getElementById('rc-i').innerText = w;
    document.getElementById('rc-u').innerText = u;
    document.getElementById('rc-a').innerText = acc.toFixed(2);

    // --- FIREBASE SAVE (Direct ID ke through) ---
    try {
        var studentId = sessionStorage.getItem('barc_logged_in'); 
        var studentName = sessionStorage.getItem('barc_student_name') || studentId;

        if (studentId) {
            var tN = window.TEST_NAME || "BARC Mock Test";
            var dt = new Date().toLocaleString();
            
            // Poori detail barc_results mein save hogi
            firebase.firestore().collection('barc_results').add({
                studentID: studentId,
                name: studentName,
                testName: tN, 
                score: sc.toFixed(2), 
                totalMarks: ms, 
                correct: c,            
                incorrect: w,          
                unattempted: u,        
                accuracy: acc.toFixed(2), 
                date: dt,
                timestamp: new Date().getTime() // Sorting ke liye use hoga
            });
        }
    } catch(e) { console.log("Database save error: ", e); }

    // --- Detailed Report & Pie Chart Generation on Screen ---
    var dH = "<h3 style='color:#003366; border-bottom:2px solid #ddd; padding-bottom:10px;'>Post-Examination Analysis</h3>";
    for (var j = 0; j < qs.length; j++) {
        var isC = (uA[j] === qs[j].a);
        var st = (uA[j] === null) ? "<span style='color:grey;'>[Unattempted]</span>" : (isC ? "<span style='color:green;'>[Correct]</span>" : "<span style='color:red;'>[Incorrect]</span>");
        var yA = (uA[j] === null) ? "None" : qs[j].o[uA[j]];
        var cA = qs[j].o[qs[j].a];
        
        dH += `<div style='padding:15px; border:1px solid #ddd; margin-bottom:15px; border-radius:5px; text-align:left; background:#fff;'>
                 <b>Q${j+1}:</b> ${st} <br><br> ${qs[j].q} <br><br>
                 <span style='color:#555'><b>Your Answer:</b> ${yA}</span><br>
                 <span style='color:green'><b>Correct Answer:</b> ${cA}</span><br>
                 <div style='background:#eef2f5; padding:10px; margin-top:10px;'><b>💡 Explanation:</b><br> ${qs[j].exp || "No explanation provided."}</div>
               </div>`;
    }
    document.getElementById('detailed-res').innerHTML = dH;
    setTimeout(() => { if (window.MathJax) MathJax.typeset(); }, 500);
    
    // Turant wala Pie Chart render karna
    if (window.Chart) {
        new Chart(document.getElementById('rc').getContext('2d'), {
            type: 'doughnut', 
            data: { labels: ['Correct', 'Incorrect', 'Unattempted'], datasets: [{ data: [c, w, u], backgroundColor: ['#28a745', '#dc3545', '#6c757d'] }] }
        });
    }
}


window.onload = iT;
