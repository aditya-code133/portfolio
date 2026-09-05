(function () {
  'use strict';

  function initHoverEffects() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const glowCards = document.querySelectorAll('.glow-card');

    glowCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--card-mouse-x', `${x}px`);
        card.style.setProperty('--card-mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--card-mouse-x');
        card.style.removeProperty('--card-mouse-y');
      });
    });

    const root = document.documentElement;
    let auraRaf = null;

    window.addEventListener(
      'mousemove',
      (e) => {
        if (!auraRaf) {
          auraRaf = requestAnimationFrame(() => {
            root.style.setProperty('--cursor-x', `${e.clientX}px`);
            root.style.setProperty('--cursor-y', `${e.clientY}px`);
            auraRaf = null;
          });
        }
      },
      { passive: true }
    );
  }

  function initHeroTerminal() {
    const tabC = document.getElementById('tab-c');
    const tabPy = document.getElementById('tab-py');
    const codeBody = document.getElementById('terminal-code-body');
    const runBtn = document.getElementById('terminal-run-trigger');
    const statusText = document.getElementById('terminal-status');

    if (!tabC || !tabPy || !codeBody || !runBtn) return;

    let currentLanguage = 'c';

    const codeSnippets = {
      c: `<span class="code-comment">// Binary Search implementation in C</span>
<span class="code-keyword">int</span> <span class="code-fn">binarySearch</span>(<span class="code-type">int</span> arr[], <span class="code-type">int</span> n, <span class="code-type">int</span> target) {
    <span class="code-type">int</span> low = <span class="code-num">0</span>, high = n - <span class="code-num">1</span>;
    <span class="code-keyword">while</span> (low &lt;= high) {
        <span class="code-type">int</span> mid = low + (high - low) / <span class="code-num">2</span>;
        <span class="code-keyword">if</span> (arr[mid] == target) <span class="code-keyword">return</span> mid;
        <span class="code-keyword">else if</span> (arr[mid] &lt; target) low = mid + <span class="code-num">1</span>;
        <span class="code-keyword">else</span> high = mid - <span class="code-num">1</span>;
    }
    <span class="code-keyword">return</span> -<span class="code-num">1</span>;
}`,
      py: `<span class="code-comment"># Two-pointer search in Python</span>
<span class="code-keyword">def</span> <span class="code-fn">two_sum_sorted</span>(arr: <span class="code-type">list[int]</span>, target: <span class="code-type">int</span>) -&gt; <span class="code-type">list[int]</span>:
    left, right = <span class="code-num">0</span>, <span class="code-fn">len</span>(arr) - <span class="code-num">1</span>
    <span class="code-keyword">while</span> left &lt; right:
        curr_sum = arr[left] + arr[right]
        <span class="code-keyword">if</span> curr_sum == target:
            <span class="code-keyword">return</span> [left, right]
        <span class="code-keyword">elif</span> curr_sum &lt; target:
            left += <span class="code-num">1</span>
        <span class="code-keyword">else</span>:
            right -= <span class="code-num">1</span>
    <span class="code-keyword">return</span> []`
    };

    function setTab(lang) {
      currentLanguage = lang;
      tabC.classList.toggle('active', lang === 'c');
      tabPy.classList.toggle('active', lang === 'py');
      codeBody.innerHTML = codeSnippets[lang];
      if (statusText) {
        statusText.textContent = lang === 'c' 
          ? 'gcc -O2 binary_search.c · ready' 
          : 'python3 algorithm.py · ready';
      }
    }

    tabC.addEventListener('click', () => setTab('c'));
    tabPy.addEventListener('click', () => setTab('py'));

    runBtn.addEventListener('click', () => {
      runBtn.disabled = true;
      const originalBtn = runBtn.innerHTML;
      runBtn.innerHTML = '<span class="spinner-rotate" aria-hidden="true"></span> Running...';

      if (statusText) {
        statusText.textContent = 'Executing test cases...';
      }

      setTimeout(() => {
        runBtn.disabled = false;
        runBtn.innerHTML = originalBtn;

        if (currentLanguage === 'c') {
          codeBody.innerHTML = `<span class="code-comment">// Output: Binary Search Execution</span>
<span style="color: #34d399;">✔ [SUCCESS] Binary Search Test Suite Passed (10/10)</span>
<span style="color: #94a3b8;">Input Array : [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]</span>
<span style="color: #94a3b8;">Search Target: 23</span>
<span style="color: #2dd4bf;">Result       : Index 5 &bull; Iterations: 3</span>
<span style="color: #818cf8;">Complexity   : O(log N) Time &bull; O(1) Space</span>`;
          if (statusText) statusText.textContent = 'Completed in 0.04ms · exit status 0';
        } else {
          codeBody.innerHTML = `<span class="code-comment"># Output: Two-Pointer Test Suite</span>
<span style="color: #34d399;">✔ [SUCCESS] All Test Cases Passed (15/15)</span>
<span style="color: #94a3b8;">Sorted Array : [1, 3, 4, 7, 10, 11, 15]</span>
<span style="color: #94a3b8;">Target Sum   : 14</span>
<span style="color: #2dd4bf;">Indices Found: [1, 5] (Values: 3 + 11 = 14)</span>
<span style="color: #818cf8;">Complexity   : O(N) Time &bull; O(1) Space</span>`;
          if (statusText) statusText.textContent = 'Completed in 0.08ms · exit status 0';
        }
      }, 600);
    });
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    const alertBox = document.getElementById('contact-alert');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !alertBox || !submitBtn) return;

    const fields = {
      name: {
        input: document.getElementById('form-name'),
        error: document.getElementById('name-error'),
        validate: (v) => v.trim().length >= 2
      },
      email: {
        input: document.getElementById('form-email'),
        error: document.getElementById('email-error'),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      },
      phone: {
        input: document.getElementById('form-phone'),
        error: document.getElementById('phone-error'),
        validate: (v) => !v.trim() || /^[+]?[0-9\s\-()]{7,20}$/.test(v.trim())
      },
      subject: {
        input: document.getElementById('form-subject'),
        error: document.getElementById('subject-error'),
        validate: (v) => v.trim().length >= 3
      },
      message: {
        input: document.getElementById('form-message'),
        error: document.getElementById('message-error'),
        validate: (v) => v.trim().length >= 10
      }
    };

    Object.keys(fields).forEach((key) => {
      const f = fields[key];
      if (!f.input) return;

      f.input.addEventListener('input', () => {
        if (f.input.classList.contains('error')) {
          if (f.validate(f.input.value)) {
            f.input.classList.remove('error');
            if (f.error) f.error.classList.remove('visible');
          }
        }
      });
    });

    function showNotification(htmlContent, type) {
      alertBox.innerHTML = htmlContent;
      alertBox.className = 'form-notification visible ' + (type === 'success' ? 'notification-success' : 'notification-error');
    }

    function clearNotification() {
      alertBox.innerHTML = '';
      alertBox.className = 'form-notification';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearNotification();

      let hasErrors = false;
      let firstInvalid = null;

      Object.keys(fields).forEach((key) => {
        const f = fields[key];
        if (!f.input) return;

        const isValid = f.validate(f.input.value);
        if (!isValid) {
          hasErrors = true;
          f.input.classList.add('error');
          if (f.error) f.error.classList.add('visible');
          if (!firstInvalid) firstInvalid = f.input;
        } else {
          f.input.classList.remove('error');
          if (f.error) f.error.classList.remove('visible');
        }
      });

      if (hasErrors) {
        showNotification('Please fill in all required fields correctly.', 'error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const nameVal = fields.name.input.value.trim();
      const emailVal = fields.email.input.value.trim();
      const phoneVal = fields.phone.input ? fields.phone.input.value.trim() : '';
      const subjectVal = fields.subject.input.value.trim();
      const messageVal = fields.message.input.value.trim();

      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-rotate" aria-hidden="true"></span> Sending...';

      let endpoint = form.getAttribute('action') || 'https://formspree.io/f/xoeqlzgw';
      if (typeof PORTFOLIO_CONFIG !== 'undefined' && PORTFOLIO_CONFIG.formspree && PORTFOLIO_CONFIG.formspree.endpoint) {
        endpoint = PORTFOLIO_CONFIG.formspree.endpoint;
      }

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        subject: subjectVal,
        message: messageVal
      };

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then((response) => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;

          if (response.ok) {
            form.reset();
            showNotification(
              `Thank you, ${nameVal}! Your message has been sent successfully.`,
              'success'
            );
          } else {
            response.json().then((data) => {
              const errMsg = (data && data.errors) ? data.errors.map(err => err.message).join(', ') : 'Unable to send message.';
              const mailtoFallback = `mailto:adityaswain.0106@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(`From: ${nameVal} (${emailVal})\n\n${messageVal}`)}`;
              showNotification(
                `Message could not be sent: ${errMsg}<br>` +
                `<a href="${mailtoFallback}" style="color: #6ee7b7; text-decoration: underline; margin-top: 6px; display: inline-block;">Send directly via email &rarr;</a>`,
                'error'
              );
            });
          }
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;

          const mailtoFallback = `mailto:adityaswain.0106@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(`From: ${nameVal} (${emailVal})\n\n${messageVal}`)}`;
          showNotification(
            `Network error occurred.<br>` +
            `<a href="${mailtoFallback}" style="color: #6ee7b7; text-decoration: underline; margin-top: 6px; display: inline-block;">Send directly via email &rarr;</a>`,
            'error'
          );
        });
    });
  }

  function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-mini-btn');

    copyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        const originalText = btn.textContent;

        const onCopied = () => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(onCopied).catch(() => fallbackCopy(textToCopy, onCopied));
        } else {
          fallbackCopy(textToCopy, onCopied);
        }
      });
    });

    function fallbackCopy(text, callback) {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.top = '-9999px';
      document.body.appendChild(area);
      area.focus();
      area.select();
      try {
        document.execCommand('copy');
        callback();
      } catch (e) {
        console.error('Copy failed', e);
      }
      document.body.removeChild(area);
    }
  }

  function initNav() {
    const hamburger = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('mobile-drawer-menu');

    if (hamburger && drawer) {
      function toggleDrawer(close) {
        const isOpen = close ? false : !drawer.classList.contains('open');
        drawer.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }

      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDrawer();
      });

      drawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => toggleDrawer(true));
      });

      document.addEventListener('click', (e) => {
        if (drawer.classList.contains('open') && !drawer.contains(e.target) && !hamburger.contains(e.target)) {
          toggleDrawer(true);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          toggleDrawer(true);
          hamburger.focus();
        }
      });
    }

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const allLinks = Array.from(document.querySelectorAll('.nav-links a, .mobile-drawer a'));

    if (sections.length && allLinks.length && 'IntersectionObserver' in window) {
      const navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.id;
              allLinks.forEach((link) => {
                const match = link.getAttribute('href') === '#' + currentId;
                link.classList.toggle('active', match);
              });
            }
          });
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      );

      sections.forEach((sec) => navObserver.observe(sec));
    }
  }

  function initScrollReveal() {
    const reveals = Array.from(document.querySelectorAll('.fade-up'));
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('in-view'));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHoverEffects();
    initHeroTerminal();
    initContactForm();
    initCopyButtons();
    initNav();
    initScrollReveal();
  });
})();
