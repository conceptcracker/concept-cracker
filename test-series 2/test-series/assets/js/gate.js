// Runs on every test page: checks login + approval, loads the protected
// questions from Firestore, then starts the test engine.
import { initPage, seedLocal, flushPending, queueResult } from './shell.js';
import { ROOT, esc } from './core.js';

const app = document.getElementById('app');
const T = window.TEST;

function screen(title, msg, btns) {
  app.innerHTML = '<div class="shell"><a class="back" href="' + (T.backUrl || 'index.html') + '">\u2190 All tests</a>' +
    '<div class="empty"><h2>' + esc(title) + '</h2><p>' + msg + '</p>' + (btns || '') + '</div></div>';
}
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
}

(async function main() {
  screen('Loading test', 'Please wait a moment.');
  const { fb, user, profile } = await initPage({ requireLogin: true });

  if (!profile || !profile.profileDone) {
    screen('Complete your profile first', 'We need a few details before you can take tests.',
      '<a class="btn btn-orange" href="' + ROOT + 'profile.html?first=1&next=' + encodeURIComponent(location.href) + '">Complete profile</a>');
    return;
  }
  if (!profile.approved) {
    screen('Waiting for approval', 'Your account has not been approved yet. Once the admin approves you, you can take this test. Please check back later.',
      '<a class="btn btn-navy" href="' + ROOT + 'profile.html">My profile</a>');
    return;
  }

  let list;
  try {
    list = await fb.getTestQuestions(T.id);
  } catch (e) {
    const denied = e && (e.code === 'permission-denied' || String(e.message).indexOf('permissions') >= 0);
    screen('Could not open this test', denied ? 'Your account does not have access to tests yet.' : 'Check your internet connection and try again.',
      '<button class="btn btn-navy" onclick="location.reload()">Try again</button>');
    return;
  }

  await flushPending(fb, user.uid);
  await seedLocal(fb, user.uid, T.id);

  window.qs = list;
  window.BTS_UID = user.uid;
  window.BTS_onFinish = function (res) {
    const docu = Object.assign({}, res, { testId: T.id, testName: T.name, group: T.group || '', page: T.page || '' });
    fb.saveResult(user.uid, docu)
      .then(() => toast('Result saved to your profile'))
      .catch(() => { queueResult(user.uid, docu); toast('You seem to be offline. Result will be saved later.'); });
  };

  const s = document.createElement('script');
  s.src = ROOT + 'assets/js/engine.js';
  document.body.appendChild(s);
})().catch(e => { console.error(e); });
