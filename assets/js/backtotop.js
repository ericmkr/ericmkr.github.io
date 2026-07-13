/**
 * ==========================================
 * BACKTOTOP.JS
 * Retour vers le haut
 * ==========================================
 */

class BackToTop {
    
   constructor() {
  
      this.button = document.getElementById("back-to-top");
      
      if (!this.button) 
         return;
 
      this.init();
   }

    
   toggle() {

      this.button.classList.toggle("show", window.scrollY > 240);
   
   }

    
   init() {
      
      this.toggle();

      window.addEventListener("scroll", () => this.toggle(), { passive: true });
 
      this.button.addEventListener("click", () =>
                 
         window.scrollTo({
            top: 0,        
            behavior: "smooth"
         })
      );
   }
}
