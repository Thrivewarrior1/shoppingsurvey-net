(function() {
  var surveySection = document.getElementById('surveySection');
  var thankyouScreen = document.getElementById('thankyouScreen');
  var form = document.getElementById('surveyForm');
  var submitBtn = form.querySelector('.submit-btn');
  var starsGroup = document.getElementById('starsGroup');
  var starsInput = document.getElementById('starsInput');

  if (localStorage.getItem('deco_survey_completed') === 'true') {
    surveySection.style.display = 'none';
    thankyouScreen.style.display = 'block';

    var savedRating = parseInt(localStorage.getItem('deco_star_rating') || '0', 10);
    if (savedRating >= 3) {
      document.getElementById('thankTitle').textContent = 'Thank you for your review!';
      document.getElementById('thankMessage').textContent = "We've sent your $25 discount code to your email. Check your inbox (and spam folder).";
    } else {
      document.getElementById('thankTitle').textContent = 'Thank you for your feedback!';
      document.getElementById('thankMessage').textContent = '';
    }
    return;
  }

  var starBtns = starsGroup.querySelectorAll('.star-btn');
  for (var i = 0; i < starBtns.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        for (var j = 0; j < starBtns.length; j++) { starBtns[j].classList.remove('selected'); }
        btn.classList.add('selected');
        starsInput.value = btn.getAttribute('data-stars');
        document.getElementById('starsError').style.display = 'none';
      });
    })(starBtns[i]);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var isValid = true;
    var name = form.querySelector('input[name="name"]').value.trim();
    var email = form.querySelector('input[name="email"]').value.trim();
    var matters = form.querySelector('input[name="matters"]:checked');
    var discover = form.querySelector('input[name="discover"]:checked');
    var trystore = form.querySelector('input[name="trystore"]:checked');
    var stars = starsInput.value;

    if (!name) {
      document.getElementById('nameError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('nameError').style.display = 'none';
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('emailError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('emailError').style.display = 'none';
    }

    if (!matters) {
      document.getElementById('mattersError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('mattersError').style.display = 'none';
    }

    if (!discover) {
      document.getElementById('discoverError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('discoverError').style.display = 'none';
    }

    if (!trystore) {
      document.getElementById('trystoreError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('trystoreError').style.display = 'none';
    }

    if (!stars) {
      document.getElementById('starsError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('starsError').style.display = 'none';
    }

    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    var starRating = parseInt(stars, 10);

    localStorage.setItem('deco_survey_completed', 'true');
    localStorage.setItem('deco_star_rating', String(starRating));

    if (starRating >= 3) {
      if (typeof fbq === 'function') {
        fbq('track', 'CompleteRegistration');
      }
      fetch('https://hook.eu1.make.com/nrjcwvu9vdy22gx5xovd9316qmu8qeyi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email })
      }).then(function() {
        window.location.href = 'https://www.trustpilot.com/evaluate/decorsdeluxe.com';
      }).catch(function() {
        window.location.href = 'https://www.trustpilot.com/evaluate/decorsdeluxe.com';
      });
    } else {
      surveySection.style.display = 'none';
      thankyouScreen.style.display = 'block';
      document.getElementById('thankTitle').textContent = 'Thank you for your feedback!';
      document.getElementById('thankMessage').textContent = '';
    }
  });
})();
