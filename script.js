
/* ============================================================
   TANVI VERMA — PORTFOLIO JAVASCRIPT
   Features:
     - Mobile menu toggle
     - Smooth scrolling
     - Active navbar link highlight on scroll
     - Scroll-triggered reveal animations
     - Skill bar animations
     - Contact form validation
     - Back to top button
   ============================================================ */

'use strict';

/* ─── DOM REFERENCES ─────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');
const backToTop   = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn   = document.getElementById('submit-btn');

/* ──────────────────────────────────────────────────────────────
   1. NAVBAR — scroll class & background
─────────────────────────────────────────────────────────────── */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load

/* ──────────────────────────────────────────────────────────────
   2. MOBILE MENU TOGGLE
─────────────────────────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

/* Close mobile menu when a nav link is clicked */
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* Close mobile menu on outside click */
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ──────────────────────────────────────────────────────────────
   3. SMOOTH SCROLLING for all internal links
─────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});

/* ──────────────────────────────────────────────────────────────
   4. ACTIVE NAVBAR LINK — highlight based on scroll position
─────────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
  const scrollPos = window.scrollY + navbar.offsetHeight + 40;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink(); // run once on load

/* ──────────────────────────────────────────────────────────────
   5. SCROLL REVEAL ANIMATIONS
      Elements with class "reveal" animate in when they enter the
      viewport via IntersectionObserver.
─────────────────────────────────────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate only once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────────────────────────
   6. SKILL BAR ANIMATIONS
      Animate width of .skill-fill elements when they become visible.
─────────────────────────────────────────────────────────────── */
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill      = entry.target;
      const targetPct = fill.getAttribute('data-width') || '0';

      // Small delay before animating so the section is visually settled
      setTimeout(() => {
        fill.style.width = `${targetPct}%`;
      }, 200);

      skillObserver.unobserve(fill);
    }
  });
}, {
  threshold: 0.3
});

skillBars.forEach(bar => skillObserver.observe(bar));

/* ──────────────────────────────────────────────────────────────
   7. BACK TO TOP BUTTON
─────────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────────────────────────
   8. CONTACT FORM VALIDATION
─────────────────────────────────────────────────────────────── */

/**
 * Shows an error message on a form field.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The input element
 * @param {HTMLElement} errorEl - The error span element
 * @param {string} message - Error message to display
 */
function showFieldError(field, errorEl, message) {
  field.classList.add('error');
  errorEl.textContent = message;
}

/**
 * Clears an error message from a form field.
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 * @param {HTMLElement} errorEl
 */
function clearFieldError(field, errorEl) {
  field.classList.remove('error');
  errorEl.textContent = '';
}

/**
 * Validates a single email address string.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates all form fields and returns true if everything is valid.
 * @returns {boolean}
 */
function validateForm() {
  const nameField    = document.getElementById('name');
  const emailField   = document.getElementById('email');
  const messageField = document.getElementById('message');

  const nameError    = document.getElementById('name-error');
  const emailError   = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  let isValid = true;

  /* --- Name --- */
  const nameVal = nameField.value.trim();
  if (!nameVal) {
    showFieldError(nameField, nameError, 'Please enter your name.');
    isValid = false;
  } else if (nameVal.length < 2) {
    showFieldError(nameField, nameError, 'Name must be at least 2 characters.');
    isValid = false;
  } else {
    clearFieldError(nameField, nameError);
  }

  /* --- Email --- */
  const emailVal = emailField.value.trim();
  if (!emailVal) {
    showFieldError(emailField, emailError, 'Please enter your email address.');
    isValid = false;
  } else if (!isValidEmail(emailVal)) {
    showFieldError(emailField, emailError, 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearFieldError(emailField, emailError);
  }

  /* --- Message --- */
  const messageVal = messageField.value.trim();
  if (!messageVal) {
    showFieldError(messageField, messageError, 'Please enter a message.');
    isValid = false;
  } else if (messageVal.length < 10) {
    showFieldError(messageField, messageError, 'Message must be at least 10 characters.');
    isValid = false;
  } else {
    clearFieldError(messageField, messageError);
  }

  return isValid;
}

/* Clear field errors live as the user types */
['name', 'email', 'message'].forEach(id => {
  const field    = document.getElementById(id);
  const errorEl  = document.getElementById(`${id}-error`);

  if (field && errorEl) {
    field.addEventListener('input', () => clearFieldError(field, errorEl));
    field.addEventListener('blur', () => {
      /* Re-validate on blur so the user gets feedback when leaving a field */
      if (field.value.trim()) {
        if (id === 'email' && !isValidEmail(field.value)) {
          showFieldError(field, errorEl, 'Please enter a valid email address.');
        }
      }
    });
  }
});

/* Form submission handler */
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  formSuccess.classList.remove('show');

  if (!validateForm()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const templateParams = {
    from_name: document.getElementById("name").value,
    from_email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_pwa2wsm", "template_kkdfz8p", templateParams)
    .then(function () {

      contactForm.reset();

      submitBtn.disabled = false;
      submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Send Message
      `;

      formSuccess.classList.add("show");

    }, function (error) {

      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      alert("Failed to send message. Please try again.");

    });
});

/* ──────────────────────────────────────────────────────────────
   9. HERO PHOTO fallback — already handled inline with onerror,
      this is just an extra safety net.
─────────────────────────────────────────────────────────────── */
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto && !heroPhoto.complete) {
  heroPhoto.addEventListener('error', () => {
    heroPhoto.src =
      'https://ui-avatars.com/api/?name=Tanvi+Verma&background=6366f1&color=fff&size=200&font-size=0.35&bold=true';
  });
}

/* ──────────────────────────────────────────────────────────────
   10. KEYBOARD ACCESSIBILITY — close menu on Escape key
─────────────────────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  }
});
