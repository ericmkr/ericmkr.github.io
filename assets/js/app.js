/**
 * ==========================================
 * APP.JS
 * Initialisation globale
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
     
   ScrollAnimations.init();

   new Parallax();

   new BackToTop();
   
   new ContactManager("footer-contact-form", "contact-feedback");

   new ContactManager("footer-contact-form-2", "contact-feedback-2");

   new ContactManager("footer-contact-form-3", "contact-feedback-3");

   new ContactManager("contact-page-form", "contact-page-feedback");

}
);