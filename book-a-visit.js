/* ============================================================
   BOOK A VISIT — book-a-visit.js
   ============================================================ */

(function () {
  var overlay      = document.getElementById('bavOverlay');
  var openBtn      = document.getElementById('bavOpenBtn');
  var closeBtn     = document.getElementById('bavCloseBtn');
  var backdrop     = document.getElementById('bavBackdrop');
  var form         = document.getElementById('bavForm');
  var submitBtn    = document.getElementById('bavSubmitBtn');
  var successEl    = document.getElementById('bavSuccess');
  var successClose = document.getElementById('bavSuccessClose');
  var consentBox   = document.getElementById('bavConsentBox');
  var checkbox     = document.getElementById('bavCheckbox');
  var queryField   = document.getElementById('bavQuery');
  var consentChecked = false;

  /* ── Project contact buttons → modal with pre-filled query ─ */
  var projectButtons = [
    {
      /* All .cm-btn-contact buttons inside each section */
      sectionId: 'cm-section',
      project:   'CM Infinia',
    
    },
    {
      sectionId: 'mdb-section',
      project:   'MDB Lutyens',
    
    },
    {
      sectionId: 'ananta-section',
      project:   'Ananta Street',
      
    }
  ];

  projectButtons.forEach(function (item) {
    var section = document.getElementById(item.sectionId);
    if (!section) return;

    /* Target every .cm-btn-contact inside this section */
    var btns = section.querySelectorAll('.cm-btn-contact');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(item.query, item.project);
      });
    });
  });

  /* ── Open / Close ─────────────────────────────────────── */
  function openModal(prefillQuery, projectName) {
    /* Pre-fill query if called from a project contact button */
    if (queryField && prefillQuery) {
      queryField.value = prefillQuery;
      queryField.classList.remove('bav-error');
      var qErr = document.getElementById('bavQueryErr');
      if (qErr) qErr.classList.remove('show');
    }

    /* Update modal sub-title to reflect the project */
    var sub = document.querySelector('.bav-modal-sub');
    if (sub && projectName) {
      sub.textContent = 'Enquiring about ' + projectName + ' — we\'ll call you within 24 hours.';
    } else if (sub) {
      sub.textContent = 'Our expert will call you within 24 hours to confirm your slot.';
    }

    overlay.classList.add('bav-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('bav-open');
    document.body.style.overflow = '';
  }

  /* Hero "Book a Site Visit" button — no pre-fill */
  if (openBtn) openBtn.addEventListener('click', function () { openModal(); });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  /* ESC to close */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('bav-open')) closeModal();
  });

  /* Success → Done button resets and closes */
  if (successClose) successClose.addEventListener('click', function () {
    closeModal();
    setTimeout(function () {
      if (form)      { form.reset(); form.style.display = ''; }
      if (successEl) successEl.classList.remove('show');
      consentChecked = false;
      if (checkbox)  checkbox.classList.remove('checked');
      if (consentBox) consentBox.setAttribute('aria-checked', 'false');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i><span>Book My Site Visit</span><span class="bav-btn-arrow"><i class="fa-solid fa-arrow-right"></i></span>';
      /* Reset subtitle */
      var sub = document.querySelector('.bav-modal-sub');
      if (sub) sub.textContent = 'Our expert will call you within 24 hours to confirm your slot.';
    }, 400);
  });

  /* ── Consent Toggle ───────────────────────────────────── */
  function toggleConsent() {
    consentChecked = !consentChecked;
    if (checkbox)   checkbox.classList.toggle('checked', consentChecked);
    if (consentBox) consentBox.setAttribute('aria-checked', String(consentChecked));
    if (consentChecked) {
      if (consentBox) consentBox.classList.remove('bav-consent-error');
      var err = document.getElementById('bavConsentErr');
      if (err) err.classList.remove('show');
    }
  }
  if (consentBox) {
    consentBox.addEventListener('click', toggleConsent);
    consentBox.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleConsent(); }
    });
  }

  /* ── Validation ───────────────────────────────────────── */
  function validate() {
    var ok = true;

    function checkField(inputId, errId, testFn) {
      var el  = document.getElementById(inputId);
      var err = document.getElementById(errId);
      if (!el || !err) return;
      var valid = testFn(el.value.trim());
      el.classList.toggle('bav-error', !valid);
      err.classList.toggle('show', !valid);
      if (!valid) ok = false;
    }

    checkField('bavName',  'bavNameErr',  function (v) { return v.length >= 2; });
    checkField('bavEmail', 'bavEmailErr', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
    checkField('bavPhone', 'bavPhoneErr', function (v) { return /^[6-9]\d{9}$/.test(v); });
    checkField('bavCity',  'bavCityErr',  function (v) { return v.length >= 2; });
    checkField('bavQuery', 'bavQueryErr', function (v) { return v.length >= 5; });

    if (!consentChecked) {
      if (consentBox) consentBox.classList.add('bav-consent-error');
      var ce = document.getElementById('bavConsentErr');
      if (ce) ce.classList.add('show');
      ok = false;
    }
    return ok;
  }

  /* Clear errors while typing */
  ['bavName', 'bavEmail', 'bavPhone', 'bavCity', 'bavQuery'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      this.classList.remove('bav-error');
      var errEl = document.getElementById(id + 'Err');
      if (errEl) errEl.classList.remove('show');
    });
  });

  /* Phone: digits only, max 10 */
  var phoneEl = document.getElementById('bavPhone');
  if (phoneEl) phoneEl.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
  });

  /* ── Submit ───────────────────────────────────────────── */
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Booking your visit…</span>';

    /* ─────────────────────────────────────────────────────
       Replace setTimeout with your real API call:

       fetch('https://your-api.com/book-visit', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           name:    document.getElementById('bavName').value.trim(),
           email:   document.getElementById('bavEmail').value.trim(),
           phone:   '+91' + document.getElementById('bavPhone').value.trim(),
           city:    document.getElementById('bavCity').value.trim(),
           query:   document.getElementById('bavQuery').value.trim(),
           consent: true
         })
       })
       .then(function(res) { return res.json(); })
       .then(function()    { showSuccess(); })
       .catch(function(err){ console.error(err); });
    ───────────────────────────────────────────────────── */

    setTimeout(showSuccess, 1800);
  });

  function showSuccess() {
    if (form)      form.style.display = 'none';
    if (successEl) successEl.classList.add('show');
    if (submitBtn) submitBtn.classList.remove('loading');
  }

})();