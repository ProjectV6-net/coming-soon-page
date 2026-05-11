// ProjectV6 — coming soon

// ── Logo: 6 clicks = ICMPv6 echo toast ──────────────────────────────────────
(function () {
  const logo = document.getElementById('logo');
  const toast = document.getElementById('toast');
  let clicks = 0;
  let toastTimer = null;

  logo.addEventListener('click', () => {
    clicks++;
    if (clicks === 6) {
      clicks = 0;
      showToast('echo reply from ::1');
    }
  });

  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  window._showToast = showToast;
})();

// ── Konami code → ICMPv6 cat easter egg ─────────────────────────────────────
(function () {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === SEQ[idx].toLowerCase()) {
      idx++;
      if (idx === SEQ.length) {
        idx = 0;
        openEgg();
      }
    } else {
      idx = e.key.toLowerCase() === SEQ[0].toLowerCase() ? 1 : 0;
    }
  });

  const egg     = document.getElementById('egg');
  const wrap    = document.getElementById('egg-cat-wrap');
  const hint    = document.getElementById('egg-hint');
  let closing   = false;

  function openEgg() {
    closing = false;
    wrap.classList.remove('closing');
    hint.textContent = 'click to close';
    egg.hidden = false;
    egg.focus();
  }

  function closeEgg() {
    if (closing) return;
    closing = true;
    hint.textContent = 'TTL expired · packet released';
    wrap.classList.add('closing');
    setTimeout(() => {
      egg.hidden = true;
      wrap.classList.remove('closing');
      closing = false;
    }, 520);
  }

  egg.addEventListener('click', closeEgg);
  egg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeEgg();
  });
})();
