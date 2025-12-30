// Simple interactions: nav toggle, year, contact form handling, modal
(function(){
  // year
  var y = new Date().getFullYear();
  ["year","year-2","year-3","year-4"].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.textContent = y;
  });

  // Set active navigation link based on current page
  function setActiveNavLink(){
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if(currentPage === '' || currentPage === '/') currentPage = 'index.html';
    
    var navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(function(link){
      var href = link.getAttribute('href');
      // Remove .nav-active from all links
      link.classList.remove('nav-active');
      
      // Check if link matches current page
      if(href === currentPage || 
         (currentPage === 'index.html' && (href === '/' || href === 'index.html')) ||
         (href === '#contact' && currentPage === 'index.html')) {
        link.classList.add('nav-active');
      }
    });
  }
  setActiveNavLink();

  // nav toggle - Enhanced with smooth animations and link closing
  var navToggles = document.querySelectorAll('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  
  function closeNav() {
    if (navToggles.length > 0) {
      navToggles.forEach(function(btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
    if (mainNav) {
      mainNav.style.display = 'none';
      mainNav.classList.remove('nav-active');
    }
  }
  
  function toggleNav() {
    if (!mainNav) return;
    var isOpen = mainNav.style.display === 'block';
    
    navToggles.forEach(function(btn) {
      btn.setAttribute('aria-expanded', (!isOpen).toString());
    });
    
    if (isOpen) {
      mainNav.classList.remove('nav-active');
      setTimeout(function() {
        mainNav.style.display = 'none';
      }, 300);
    } else {
      mainNav.style.display = 'block';
      setTimeout(function() {
        mainNav.classList.add('nav-active');
      }, 10);
    }
  }
  
  // Toggle button click
  navToggles.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleNav();
    });
  });
  
  // Close menu when clicking on a link
  if (mainNav) {
    var navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        closeNav();
      });
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mainNav && mainNav.style.display === 'block') {
      if (!mainNav.contains(e.target) && !e.target.closest('.nav-toggle')) {
        closeNav();
      }
    }
  });

  // footer contact forms - validation + real submit via FormSubmit (sends to Outlook)
  var CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/victorericmoukouri@outlook.com';

  function sendContact(data){
    return fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        _subject: 'Nouveau message portfolio',
        _template: 'table'
      })
    }).then(function(res){
      if(!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  function bindContact(idForm,idFeedback){
    var form = document.getElementById(idForm);
    if(!form) return;
    var feedback = document.getElementById(idFeedback);
    var submitBtn = form.querySelector('button[type="submit"], .btn');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      var msg = (form.querySelector('[name="message"]')||{value:''}).value.trim();
      
      // Email validation regex
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if(!name){ if(feedback) feedback.textContent = '❌ Please enter your name.'; return; }
      if(!email){ if(feedback) feedback.textContent = '❌ Please enter an email address.'; return; }
      if(!emailRegex.test(email)){ if(feedback) feedback.textContent = '❌ Invalid email address (example: user@domain.com).'; return; }
      if(!msg){ if(feedback) feedback.textContent = '❌ Please enter a message.'; return; }
      if(msg.length < 5){ if(feedback) feedback.textContent = '❌ The message must contain at least 5 characters.'; return; }

      // lock UI while sending
      if(submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      if(feedback) feedback.textContent = 'Envoi en cours...';

      sendContact({ name: name, email: email, message: msg })
        .then(function(){
          if(feedback) feedback.textContent = '✅ Message sent successfully!';
          form.reset();
          showSubmitConfirmation('Message sent', 'Thank you — your message has been sent.');
          setTimeout(function(){ if(feedback) feedback.textContent = ''; }, 3000);
        })
        .catch(function(){
          if(feedback) feedback.textContent = '❌ Send failed. Please try again or email victorericmoukouri@outlook.com';
        })
        .finally(function(){
          if(submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }
        });
    });
  }
  bindContact('footer-contact-form','contact-feedback');
  bindContact('footer-contact-form-2','contact-feedback-2');
  bindContact('footer-contact-form-3','contact-feedback-3');
  bindContact('contact-page-form','contact-page-feedback');

  // Project modal with improved animations and keyboard support
  var modal = document.getElementById('project-modal');
  var modalBody = document.getElementById('modal-body');
  var closeBtn = document.getElementById('modal-close');
  function openModal(content){
    if(!modal) return;
    if(modalBody) modalBody.innerHTML = content;
    modal.setAttribute('aria-hidden','false');
    if(closeBtn) closeBtn.focus();
  }
  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
  }
  document.querySelectorAll('.view-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.getAttribute('data-project') || '';
      var title = btn.getAttribute('data-title') || ('Projet ' + id);
      var content = '<h2>' + title + '</h2><p>Project overview, challenges, UX solutions and screenshots.</p>';
      openModal(content);
    });
  });
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

  // IntersectionObserver for reveal animations
  try{
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.animate-fade').forEach(function(el){ observer.observe(el); });
  }catch(e){ /* fall back silently on older browsers */ }

  // Simple parallax: translateY based on element position (requestAnimationFrame)
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('.parallax'));
  function updateParallax(){
    var vh = window.innerHeight;
    parallaxEls.forEach(function(el){
      var rect = el.getBoundingClientRect();
      var speed = parseFloat(el.dataset.parallaxSpeed) || 0.05;
      var centerOffset = rect.top + rect.height/2 - vh/2;
      var translate = -centerOffset * speed;
      // Limit translate to avoid huge moves
      if(translate > 80) translate = 80;
      if(translate < -80) translate = -80;
      el.style.transform = 'translateY(' + translate + 'px)';
    });
  }
  var ticking = false;
  function onScroll(){ if(!ticking){ requestAnimationFrame(function(){ updateParallax(); ticking = false; }); ticking = true; }}
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function(){ updateParallax(); });
  // initial position
  updateParallax();

  // Back-to-top button: reveal on scroll and smooth return to top
  var backTopBtn = document.getElementById('back-to-top');
  function updateBackToTopVisibility(){
    if(!backTopBtn) return;
    var shouldShow = window.scrollY > 240;
    if(shouldShow) backTopBtn.classList.add('show');
    else backTopBtn.classList.remove('show');
  }
  if(backTopBtn){
    backTopBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
    window.addEventListener('resize', updateBackToTopVisibility);
    updateBackToTopVisibility();
  }

  /* Submit confirmation overlay helpers */
  function ensureSubmitElements(){
    if(document.getElementById('submit-overlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'submit-overlay';
    overlay.className = 'submit-overlay';
    overlay.setAttribute('aria-hidden','true');

    var modal = document.createElement('div');
    modal.className = 'submit-modal';
    modal.innerHTML = '<h3>Message sent</h3><p>Thank you — your message has been successfully received (simulation).</p>'; 
    var btn = document.createElement('button');
    btn.className = 'close-submit';
    btn.textContent = 'Close';
    btn.type = 'button';
    btn.addEventListener('click', function(){ closeSubmitConfirmation(); });
    modal.appendChild(btn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // click outside to close
    overlay.addEventListener('click', function(e){ if(e.target === overlay) closeSubmitConfirmation(); });
    // Esc to close
    document.addEventListener('keydown', function onEsc(e){ if(e.key === 'Escape'){ closeSubmitConfirmation(); } });
  }

  function showSubmitConfirmation(title, message){
    ensureSubmitElements();
    var overlay = document.getElementById('submit-overlay');
    if(!overlay) return;
    var modal = overlay.querySelector('.submit-modal');
    if(modal){
      modal.querySelector('h3').textContent = title || 'Message sent';
      modal.querySelector('p').textContent = message || 'Thank you — your message has been successfully received.';
    }
    overlay.setAttribute('aria-hidden','false');
    // focus the close button for accessibility
    var btn = overlay.querySelector('.close-submit');
    if(btn) btn.focus();
  }

  function closeSubmitConfirmation(){
    var overlay = document.getElementById('submit-overlay');
    if(!overlay) return;
    overlay.setAttribute('aria-hidden','true');
    // remove from DOM after animation completes for cleanliness
    setTimeout(function(){ if(overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); },350);
  }

  var musicToggle = document.getElementById('music-toggle');
  var bgMusic = document.getElementById('bg-music');
  var isPlaying = false;

  if(musicToggle && bgMusic) {
    musicToggle.addEventListener('click', function() {
      if(isPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        isPlaying = false;
        } 
      else {
        bgMusic.play().catch(function(e) {
        console.log('Playback failed:', e);
        });
        musicToggle.textContent = '🔊';
        isPlaying = true;
      }
    });
  }

})();
