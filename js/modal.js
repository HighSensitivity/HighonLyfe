(function () {
  let overlay, titleEl, messageEl, cancelBtn, okBtn;
  let escapeHandler;

  function build() {
    if (document.getElementById('hy-modal-overlay')) {
      overlay = document.getElementById('hy-modal-overlay');
      titleEl = overlay.querySelector('.hy-modal-title');
      messageEl = overlay.querySelector('.hy-modal-text');
      cancelBtn = overlay.querySelector('[data-hy-cancel]');
      okBtn = overlay.querySelector('[data-hy-ok]');
      return;
    }
    overlay = document.createElement('div');
    overlay.id = 'hy-modal-overlay';
    overlay.className = 'hy-modal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="hy-modal" role="dialog" aria-modal="true" aria-labelledby="hy-modal-title">' +
      '<h2 id="hy-modal-title" class="hy-modal-title"></h2>' +
      '<p class="hy-modal-text"></p>' +
      '<div class="hy-modal-actions">' +
      '<button type="button" class="hy-modal-btn hy-modal-btn-ghost" data-hy-cancel>Cancel</button>' +
      '<button type="button" class="hy-modal-btn hy-modal-btn-primary" data-hy-ok>OK</button>' +
      '</div></div>';
    document.body.appendChild(overlay);
    titleEl = overlay.querySelector('.hy-modal-title');
    messageEl = overlay.querySelector('.hy-modal-text');
    cancelBtn = overlay.querySelector('[data-hy-cancel]');
    okBtn = overlay.querySelector('[data-hy-ok]');
  }

  function open() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('hy-modal-open');
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('hy-modal-open');
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
      escapeHandler = null;
    }
    overlay.onclick = null;
    cancelBtn.onclick = null;
    okBtn.onclick = null;
  }

  /**
   * @param {string} message
   * @param {{ title?: string, okLabel?: string }} [opts]
   * @returns {Promise<void>}
   */
  window.hyAlert = function (message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      build();
      titleEl.textContent = opts.title != null ? opts.title : 'Notice';
      messageEl.textContent = message;
      cancelBtn.style.display = 'none';
      okBtn.textContent = opts.okLabel || 'OK';

      function done() {
        close();
        resolve();
      }
      okBtn.onclick = done;

      escapeHandler = function (e) {
        if (e.key === 'Escape') done();
      };
      document.addEventListener('keydown', escapeHandler);

      overlay.onclick = function (e) {
        if (e.target === overlay) done();
      };

      open();
      okBtn.focus();
    });
  };

  /**
   * @param {string} message
   * @param {{ title?: string, confirmLabel?: string, cancelLabel?: string }} [opts]
   * @returns {Promise<boolean>}
   */
  window.hyConfirm = function (message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      build();
      titleEl.textContent = opts.title != null ? opts.title : 'Are you sure?';
      messageEl.textContent = message;
      cancelBtn.style.display = '';
      cancelBtn.textContent = opts.cancelLabel || 'Cancel';
      okBtn.textContent = opts.confirmLabel || 'OK';

      function finish(value) {
        close();
        resolve(value);
      }
      cancelBtn.onclick = function () {
        finish(false);
      };
      okBtn.onclick = function () {
        finish(true);
      };

      escapeHandler = function (e) {
        if (e.key === 'Escape') finish(false);
      };
      document.addEventListener('keydown', escapeHandler);

      overlay.onclick = function (e) {
        if (e.target === overlay) finish(false);
      };

      open();
      okBtn.focus();
    });
  };
})();
