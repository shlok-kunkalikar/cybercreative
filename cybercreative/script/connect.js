    (function () {
      var currentStep = 1;
      var totalSteps = 3;
      var progressPcts = { 1: 33, 2: 66, 3: 100 };

      function goToStep(n) {
        // Hide all panels
        document.querySelectorAll('.cf-panel').forEach(function (p) { p.classList.remove('active'); });
        document.getElementById('panel-' + n).classList.add('active');

        // Update step labels
        for (var i = 1; i <= totalSteps; i++) {
          var lbl = document.getElementById('step-label-' + i);
          lbl.classList.remove('active', 'done');
          if (i < n) lbl.classList.add('done');
          else if (i === n) lbl.classList.add('active');
        }

        // Progress bar
        document.getElementById('cfProgress').style.width = progressPcts[n] + '%';
        currentStep = n;
      }

      function validateStep1() {
        var ok = true;
        var fname = document.getElementById('fname');
        var lname = document.getElementById('lname');
        var email = document.getElementById('email');
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        [fname, lname, email].forEach(function (el) { el.classList.remove('error'); });
        ['err-fname', 'err-lname', 'err-email'].forEach(function (id) {
          document.getElementById(id).classList.remove('visible');
        });

        if (!fname.value.trim()) { fname.classList.add('error'); document.getElementById('err-fname').classList.add('visible'); ok = false; }
        if (!lname.value.trim()) { lname.classList.add('error'); document.getElementById('err-lname').classList.add('visible'); ok = false; }
        if (!emailRe.test(email.value.trim())) { email.classList.add('error'); document.getElementById('err-email').classList.add('visible'); ok = false; }
        return ok;
      }

      function validateStep2() {
        var svc = document.getElementById('service');
        document.getElementById('err-service').classList.remove('visible');
        if (!svc.value) {
          document.getElementById('err-service').classList.add('visible');
          return false;
        }
        return true;
      }

      function validateStep3() {
        var msg = document.getElementById('message');
        msg.classList.remove('error');
        document.getElementById('err-message').classList.remove('visible');
        if (!msg.value.trim()) {
          msg.classList.add('error');
          document.getElementById('err-message').classList.add('visible');
          return false;
        }
        return true;
      }

      // Service pills
      document.querySelectorAll('.service-pill').forEach(function (pill) {
        pill.addEventListener('click', function () {
          document.querySelectorAll('.service-pill').forEach(function (p) { p.classList.remove('selected'); });
          pill.classList.add('selected');
          document.getElementById('service').value = pill.getAttribute('data-val');
          document.getElementById('err-service').classList.remove('visible');
        });
      });

      // Char count
      var msgArea = document.getElementById('message');
      var charCount = document.getElementById('charCount');
      if (msgArea) {
        msgArea.addEventListener('input', function () {
          var len = msgArea.value.length;
          charCount.textContent = len + ' / 500';
          if (len > 500) { msgArea.value = msgArea.value.substring(0, 500); charCount.textContent = '500 / 500'; }
        });
      }

      // Navigation
      document.getElementById('next-1').addEventListener('click', function () {
        if (validateStep1()) goToStep(2);
      });
      document.getElementById('back-2').addEventListener('click', function () { goToStep(1); });
      document.getElementById('next-2').addEventListener('click', function () {
        if (validateStep2()) goToStep(3);
      });
      document.getElementById('back-3').addEventListener('click', function () { goToStep(2); });

      // Submit
      document.getElementById('cfSubmit').addEventListener('click', function () {
        if (!validateStep3()) return;
        var btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        setTimeout(function () {
          document.getElementById('cfWrapper').style.display = 'none';
          document.getElementById('formSuccess').classList.add('visible');
        }, 1400);
      });

      // Reset — go back to blank form
      document.getElementById('resetForm').addEventListener('click', function () {
        // Clear all inputs
        ['fname', 'lname', 'email', 'phone', 'message'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
        ['budget', 'timeline'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.selectedIndex = 0;
        });
        document.getElementById('service').value = '';
        document.querySelectorAll('.service-pill').forEach(function (p) { p.classList.remove('selected'); });
        document.getElementById('charCount').textContent = '0 / 500';

        // Clear any error states
        document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function (el) {
          el.classList.remove('error');
        });
        document.querySelectorAll('.form-error-msg').forEach(function (el) {
          el.classList.remove('visible');
        });

        // Re-enable submit button
        var submitBtn = document.getElementById('cfSubmit');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';

        // Show form, hide success
        document.getElementById('formSuccess').classList.remove('visible');
        document.getElementById('cfWrapper').style.display = '';

        // Back to step 1
        goToStep(1);
      });
    })();
  
