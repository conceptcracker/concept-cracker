// ==================================================
// 🔥 100% ORIGINAL TCS iON CALCULATOR (WITH MINIMIZE FIX) 🔥
// ==================================================

// 1. EXACT CSS INJECTION
const calcStyle = document.createElement('style');
calcStyle.innerHTML = `
    #tcs-calc-container { display: none; position: fixed; top: 15%; left: 50%; transform: translateX(-50%); z-index: 99999; width: 560px; max-width: 98%; background: #dcdcdc; border: 1px solid #888; border-radius: 2px; box-shadow: 0 12px 30px rgba(0,0,0,0.5); font-family: Arial, Helvetica, sans-serif; user-select: none; touch-action: none; }
    #tcs-drag-handle { background: #428bca; color: white; padding: 8px 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2b669a; }
    #tcs-drag-handle .title { font-size: 15px; font-weight: normal; }
    .tcs-top-actions { display: flex; gap: 8px; align-items: center; }
    .tcs-help-btn { background: #5bc0de; color: white; padding: 4px 14px; border-radius: 2px; font-size: 13px; cursor: pointer; border: none; font-weight: bold; }
    .tcs-help-btn:active { background: #31b0d5; }
    .tcs-win-btn { cursor: pointer; font-size: 18px; font-weight: bold; color: white; padding: 0 4px; }
    .tcs-body { padding: 12px; }
    .tcs-disp-box { margin-bottom: 12px; background: #fff; padding: 5px; border-bottom: 1px solid #fff; border-right: 1px solid #fff; border-top: 2px solid #888; border-left: 2px solid #888; border-radius: 2px; }
    .tcs-exp { width: 100%; height: 22px; border: none; outline: none; text-align: right; font-size: 14px; color: #444; background: transparent; font-family: Arial, sans-serif; margin-bottom: 2px; }
    .tcs-val { width: 100%; height: 35px; border: none; outline: none; text-align: right; font-size: 26px; font-weight: bold; color: #000; background: transparent; font-family: Arial, sans-serif; }
    .tcs-row1 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .tcs-row1-left { display: flex; align-items: center; gap: 10px; }
    .tcs-row1-right { display: flex; gap: 5px; }
    .tcs-radios { display: flex; gap: 8px; font-size: 13px; color: #000; align-items: center; margin-left: 5px; }
    .tcs-radios input { margin: 0 4px 0 0; cursor: pointer; transform: scale(1.1); }
    .tcs-grid { display: grid; grid-template-columns: repeat(11, 1fr); gap: 6px; }
    .tcs-btn { height: 38px; font-size: 13px; font-family: Arial, sans-serif; font-weight: bold; background: #f4f4f4; border: 1px solid #bbb; border-bottom: 3px solid #a0a0a0; border-right: 1px solid #a0a0a0; border-radius: 3px; cursor: pointer; color: #333; outline: none; padding: 0; transition: none; }
    .tcs-row1-btn { min-width: 46px; padding: 0 5px; }
    .tcs-btn:active { background: #e4e4e4; border-bottom: 1px solid #a0a0a0; transform: translateY(2px); }
    .tcs-btn-num { font-size: 16px; color: #000; }
    .tcs-btn-red { background: #e74c3c !important; color: white !important; border-color: #c0392b !important; border-bottom: 3px solid #b33527 !important; border-right: 1px solid #b33527 !important; font-size: 16px; }
    .tcs-btn-red:active { border-bottom: 1px solid #b33527 !important; transform: translateY(2px); }
    .tcs-btn-green { background: #2ecc71 !important; color: white !important; border-color: #27ae60 !important; border-bottom: 3px solid #219653 !important; border-right: 1px solid #219653 !important; font-size: 22px !important; grid-row: span 2; height: 100% !important; }
    .tcs-btn-green:active { border-bottom: 1px solid #219653 !important; transform: translateY(2px); }
    .tcs-span-2 { grid-column: span 2; }
    sup, sub { font-size: 10px; }
`;
document.head.appendChild(calcStyle);

// 2. HTML STRUCTURE (ADDED MINIMIZE ID & ONCLICK)
window.addEventListener('DOMContentLoaded', () => {
    const calcDiv = document.createElement('div');
    calcDiv.id = "tcs-calc-container";
    calcDiv.innerHTML = `
        <div id="tcs-drag-handle">
            <span class="title">Scientific Calculator</span>
            <div class="tcs-top-actions">
                <button class="tcs-help-btn" onclick="showHelp()">Help</button>
                <span class="tcs-win-btn" onclick="tcsMin()">_</span> <span class="tcs-win-btn close-calc" onclick="tcsToggle()">✖</span>
            </div>
        </div>
        <div class="tcs-body" id="tcs-body-id"> <div class="tcs-disp-box">
                <input type="text" id="tcs-exp" class="tcs-exp" disabled>
                <input type="text" id="tcs-val" class="tcs-val" value="0" disabled>
            </div>
            <div class="tcs-row1">
                <div class="tcs-row1-left">
                    <button class="tcs-btn tcs-row1-btn" onclick="tB('mod')">mod</button>
                    <div class="tcs-radios">
                        <label><input type="radio" name="ang" id="deg" checked> Deg</label>
                        <label><input type="radio" name="ang" id="rad"> Rad</label>
                    </div>
                </div>
                <div class="tcs-row1-right">
                    <button class="tcs-btn tcs-row1-btn" onclick="tMem('MC')">MC</button>
                    <button class="tcs-btn tcs-row1-btn" onclick="tMem('MR')">MR</button>
                    <button class="tcs-btn tcs-row1-btn" onclick="tMem('MS')">MS</button>
                    <button class="tcs-btn tcs-row1-btn" onclick="tMem('M+')">M+</button>
                    <button class="tcs-btn tcs-row1-btn" onclick="tMem('M-')">M-</button>
                </div>
            </div>
            <div class="tcs-grid">
                <button class="tcs-btn" onclick="tU('sinh')">sinh</button>
                <button class="tcs-btn" onclick="tU('cosh')">cosh</button>
                <button class="tcs-btn" onclick="tU('tanh')">tanh</button>
                <button class="tcs-btn" onclick="tB('Exp')">Exp</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('(')">(</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN(')')">)</button>
                <button class="tcs-btn tcs-btn-red tcs-span-2" onclick="tDel()">&#8592;</button>
                <button class="tcs-btn tcs-btn-red" onclick="tClr()">C</button>
                <button class="tcs-btn tcs-btn-red" onclick="tU('sign')">+/-</button>
                <button class="tcs-btn tcs-btn-num" onclick="tU('sqrt')">&radic;</button>
                
                <button class="tcs-btn" onclick="tU('asinh')">sinh⁻¹</button>
                <button class="tcs-btn" onclick="tU('acosh')">cosh⁻¹</button>
                <button class="tcs-btn" onclick="tU('atanh')">tanh⁻¹</button>
                <button class="tcs-btn" onclick="tU('log2')">log<sub>2</sub>x</button>
                <button class="tcs-btn" onclick="tU('ln')">ln</button>
                <button class="tcs-btn" onclick="tU('log')">log</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('7')">7</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('8')">8</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('9')">9</button>
                <button class="tcs-btn tcs-btn-num" onclick="tB('/')">/</button>
                <button class="tcs-btn tcs-btn-num" onclick="tB('%')">%</button>
                
                <button class="tcs-btn tcs-btn-num" onclick="tPi()">&pi;</button>
                <button class="tcs-btn tcs-btn-num" onclick="tE()">e</button>
                <button class="tcs-btn" onclick="tU('fact')">n!</button>
                <button class="tcs-btn" onclick="tB('logy')">log<sub>y</sub>x</button>
                <button class="tcs-btn" onclick="tU('e^x')">eˣ</button>
                <button class="tcs-btn" onclick="tU('10^x')">10ˣ</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('4')">4</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('5')">5</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('6')">6</button>
                <button class="tcs-btn tcs-btn-num" onclick="tB('*')">*</button>
                <button class="tcs-btn tcs-btn-num" onclick="tU('1/x')">1/x</button>
                
                <button class="tcs-btn" onclick="tU('sin')">sin</button>
                <button class="tcs-btn" onclick="tU('cos')">cos</button>
                <button class="tcs-btn" onclick="tU('tan')">tan</button>
                <button class="tcs-btn" onclick="tB('x^y')">xʸ</button>
                <button class="tcs-btn" onclick="tU('cube')">x³</button>
                <button class="tcs-btn" onclick="tU('sqr')">x²</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('1')">1</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('2')">2</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('3')">3</button>
                <button class="tcs-btn tcs-btn-num" onclick="tB('-')">-</button>
                <button class="tcs-btn tcs-btn-green" onclick="tEq()">=</button>
                
                <button class="tcs-btn" onclick="tU('asin')">sin⁻¹</button>
                <button class="tcs-btn" onclick="tU('acos')">cos⁻¹</button>
                <button class="tcs-btn" onclick="tU('atan')">tan⁻¹</button>
                <button class="tcs-btn" onclick="tU('cbrt')">&#8731;x</button>
                <button class="tcs-btn" onclick="tB('yroot')"><sup>y</sup>&radic;x</button>
                <button class="tcs-btn" onclick="tU('abs')">|x|</button>
                <button class="tcs-btn tcs-btn-num tcs-span-2" onclick="tN('0')">0</button>
                <button class="tcs-btn tcs-btn-num" onclick="tN('.')">.</button>
                <button class="tcs-btn tcs-btn-num" onclick="tB('+')">+</button>
            </div>
        </div>
    `;
    document.body.appendChild(calcDiv);

    // DRAG LOGIC
    var cCon = document.getElementById("tcs-calc-container");
    var dHan = document.getElementById("tcs-drag-handle");
    var isD = false, oX, oY;

    const startDrag = (e) => {
        if(e.target.tagName.toLowerCase() === 'button' || e.target.classList.contains('close-calc') || e.target.getAttribute('onclick') === 'tcsMin()') return;
        isD = true;
        let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        let clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        if(cCon.style.transform !== 'none') {
            let rect = cCon.getBoundingClientRect();
            cCon.style.transform = 'none';
            cCon.style.left = rect.left + 'px';
            cCon.style.top = rect.top + 'px';
        }
        oX = clientX - cCon.offsetLeft;
        oY = clientY - cCon.offsetTop;
    };

    const doDrag = (e) => {
        if (!isD) return;
        e.preventDefault(); 
        let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        let clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        cCon.style.left = (clientX - oX) + 'px';
        cCon.style.top = (clientY - oY) + 'px';
    };

    const stopDrag = () => { isD = false; };

    dHan.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    dHan.addEventListener('touchstart', startDrag, {passive: false});
    document.addEventListener('touchmove', doDrag, {passive: false});
    document.addEventListener('touchend', stopDrag);
});


// ==========================================================
// 🔥 3. MATH LOGIC & TOGGLE FUNCTIONS 🔥
// ==========================================================
var expArr = []; 
var tBot = "0";
var isN = true;
var mem = 0;
var lastPress = ''; 

// The Minimize Function
function tcsMin() {
    var b = document.getElementById('tcs-body-id');
    if (b.style.display === 'none') {
        b.style.display = 'block';
    } else {
        b.style.display = 'none';
    }
}

function tcsToggle(){
    var c=document.getElementById('tcs-calc-container');
    c.style.display = (c.style.display==='block') ? 'none' : 'block';
}

function tD(){
    document.getElementById('tcs-val').value = tBot;
    document.getElementById('tcs-exp').value = expArr.map(x => {
        if(x === '**') return '^';
        if(x === '* 10 **') return 'E';
        return x;
    }).join(" ");
}

function tN(n){
    if (n === '(') { 
        expArr.push('('); tBot = "0"; isN = true; lastPress = '('; tD(); return; 
    }
    if (n === ')') {
        if (lastPress !== 'op' && lastPress !== '(' && expArr.length > 0) expArr.push(tBot);
        expArr.push(')');
        isN = true; lastPress = ')';
        try { tBot = safeEval(expArr).toString(); } catch(e) {}
        tD(); return;
    }
    if(isN){ tBot = n; isN = false; }
    else { tBot = (tBot === "0" && n !== ".") ? n : tBot + n; }
    lastPress = 'num';
    tD();
}

function tB(op){
    if (lastPress === 'num' || lastPress === 'unary' || lastPress === ')') {
        if (lastPress !== ')') expArr.push(tBot);
    } else if (lastPress === 'op') {
        expArr.pop(); 
    }
    
    let opMap = { '+': '+', '-': '-', '*': '*', '/': '/', 'mod': '%', '%': '%', 'x^y': '**', 'Exp': '* 10 **', 'yroot': 'yroot', 'logy': 'logy' };
    expArr.push(opMap[op] || op);
    isN = true;
    lastPress = 'op';
    tD();
}

function safeEval(arr) {
    if(arr.length === 0) return 0;
    let str = arr.join(" ");
    str = str.replace(/([0-9\.\-]+)\s+yroot\s+([0-9\.\-]+)/g, 'Math.pow($1, 1/$2)');
    str = str.replace(/([0-9\.\-]+)\s+logy\s+([0-9\.\-]+)/g, '(Math.log($1)/Math.log($2))');
    return Function('"use strict";return (' + str + ')')();
}

function tEq(){
    if (lastPress === 'num' || lastPress === 'unary') {
        expArr.push(tBot);
    }
    try {
        let res = safeEval(expArr);
        tBot = parseFloat(res.toFixed(12)).toString();
        expArr = [];
        lastPress = 'unary'; 
    } catch(e) {
        tBot = "Error"; expArr = []; lastPress = '';
    }
    isN = true; tD();
}

function tClr(){ expArr = []; tBot = "0"; isN = true; lastPress = ''; tD(); }
function tDel(){ if(lastPress === 'num' || lastPress === ''){ tBot = tBot.slice(0,-1) || "0"; tD(); } }
function tPi(){ tBot = Math.PI.toString(); isN = true; lastPress = 'unary'; tD(); }
function tE(){ tBot = Math.E.toString(); isN = true; lastPress = 'unary'; tD(); }

function tMem(op){
    if(op === 'MC') { mem = 0; }
    else if(op === 'MR') { tBot = mem.toString(); isN = true; lastPress = 'unary'; tD(); }
    else if(op === 'MS') { mem = parseFloat(tBot); isN = true; lastPress = 'unary'; }
    else if(op === 'M+') { mem += parseFloat(tBot); isN = true; lastPress = 'unary'; }
    else if(op === 'M-') { mem -= parseFloat(tBot); isN = true; lastPress = 'unary'; }
}

function fact(n){
    if(n < 0 || !Number.isInteger(n)) return "Error";
    if(n === 0 || n === 1) return 1;
    let res = 1; for(let i = 2; i <= n; i++) res *= i; return res;
}

function tU(op){
    let v = parseFloat(tBot), r = 0, isDeg = document.getElementById('deg').checked;
    let rad = isDeg ? (v * Math.PI / 180) : v;
    try {
        if(op === 'sin') r = Math.sin(rad);
        else if(op === 'cos') r = Math.cos(rad);
        else if(op === 'tan') r = Math.tan(rad);
        else if(op === 'asin') r = isDeg ? (Math.asin(v) * 180 / Math.PI) : Math.asin(v);
        else if(op === 'acos') r = isDeg ? (Math.acos(v) * 180 / Math.PI) : Math.acos(v);
        else if(op === 'atan') r = isDeg ? (Math.atan(v) * 180 / Math.PI) : Math.atan(v);
        else if(op === 'sinh') r = Math.sinh(v);
        else if(op === 'cosh') r = Math.cosh(v);
        else if(op === 'tanh') r = Math.tanh(v);
        else if(op === 'asinh') r = Math.asinh(v);
        else if(op === 'acosh') r = Math.acosh(v);
        else if(op === 'atanh') r = Math.atanh(v);
        else if(op === 'sqrt') r = Math.sqrt(v);
        else if(op === 'cbrt') r = Math.cbrt(v);
        else if(op === 'sqr') r = v * v;
        else if(op === 'cube') r = v * v * v;
        else if(op === '1/x') r = 1 / v;
        else if(op === 'fact') r = fact(v);
        else if(op === 'log') r = Math.log10(v);
        else if(op === 'ln') r = Math.log(v);
        else if(op === 'log2') r = Math.log2(v);
        else if(op === 'e^x') r = Math.exp(v);
        else if(op === '10^x') r = Math.pow(10, v);
        else if(op === 'abs') r = Math.abs(v);
        else if(op === 'sign') r = -v;
        
        tBot = isNaN(r) ? "Error" : parseFloat(r.toFixed(12)).toString();
        isN = true; lastPress = 'unary'; tD();
    } catch(e) { tBot = "Error"; tD(); }
}

function showHelp(){
    alert("Scientific Calculator Help:\n\n• Use 'Deg' or 'Rad' for angles.\n• MC: Clear Memory\n• MR: Recall Memory\n• MS: Store Memory\n• M+: Add to Memory\n• M-: Subtract from Memory\n• +/- : Change Sign\n• C : Clear current values");
}
