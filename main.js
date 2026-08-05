// ProjectV6 - coming soon

// Logo: 6 clicks = ICMPv6 echo toast
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

// Konami code = ICMPv6 cat easter egg
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

// Spotlight effect on bottom section
(function () {
  const bottom = document.querySelector('.bottom');

  window.addEventListener('mousemove', (e) => {
    const rect = bottom.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
    const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = Math.max(0, 120 * (1 - dist / 150));
    bottom.style.setProperty('--x', x + 'px');
    bottom.style.setProperty('--y', y + 'px');
    bottom.style.setProperty('--r', r + 'px');
  });
})();

// Email link with picker
(function () {
  const picker = document.getElementById('mail-picker');
  const addr = document.getElementById('mail-picker-addr');
  const gmail = document.getElementById('opt-gmail');
  const outlook = document.getElementById('opt-outlook');
  const copy = document.getElementById('opt-copy');
  let currentEmail = '';
  let closePickerTimer = null;

  document.querySelectorAll('.mail-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const email = link.dataset.email;
      const alreadyOpen = !picker.hidden && currentEmail === email && !picker.classList.contains('closing')

      if (alreadyOpen) {
        closePicker()
        return;
      }
      if (closePickerTimer) clearTimeout(closePickerTimer);
      picker.classList.remove('closing');

      currentEmail = email;
      addr.textContent = currentEmail;
      const rect = link.getBoundingClientRect();
      picker.style.top = (rect.bottom + 8) + 'px';
      const left = Math.min(rect.left, window.innerWidth - 248); 
      picker.style.left = left + 'px';
      picker.hidden = false;
    });
  });

  function closePicker() {
    if (picker.hidden || picker.classList.contains('closing')) return;
    picker.classList.add('closing');
    closePickerTimer = setTimeout(() => {
      picker.hidden = true;
      picker.classList.remove('closing');
    }, 160);
  }

  gmail.addEventListener('click', () => {
    window.open('https://mail.google.com/mail/?view=cm&to=' + currentEmail, '_blank');
      closePicker();
  });

  outlook.addEventListener('click', () => {
    window.open('https://outlook.live.com/mail/deeplink/compose?to=' + currentEmail, '_blank');
      closePicker();
  });

  let copyCombo = 0;
  let comboTimer = null;
  let closeTimer = null;
  let isRateLimited = false;
  const comboMessages = [
    'Damn.',
    'DAMN.',
    'You already copied it, stop.',
    "The email didn't change. Why are you still clicking?",
    'Told you to stop!',
  ]
   
   copy.addEventListener('click', () => {
     if (isRateLimited) {
       copy.textContent = '❌ rate limited';
       return;
     }

     navigator.clipboard.writeText(currentEmail);
     copyCombo++;
     
    copy.textContent = copyCombo > 1 ? `✅ copied! \u00D7${copyCombo}` : '✅ copied!';

    if (copyCombo % 20 === 0) {
      const msg = comboMessages[Math.floor(copyCombo / 20 - 1) % comboMessages.length];
      window._showToast(msg);
      if (copyCombo >= 100) {
      isRateLimited = true;
      copy.textContent = '❌ rate limited'
      closeTimer = setTimeout(() => { closePicker(); }, 2000);
      return;
    }
    }

    if (comboTimer) clearTimeout(comboTimer);
    if (closeTimer) clearTimeout(closeTimer);

    comboTimer = setTimeout(() => {
      if (!isRateLimited) {
        copyCombo = 0;
        copy.textContent = '📋 copy email';
        closeTimer = setTimeout(() => { closePicker(); }, 500);
      }
    }, 1500);
  });

  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target) && !e.target.closest('.mail-link')) {
      closePicker();
    }
  });
})();
