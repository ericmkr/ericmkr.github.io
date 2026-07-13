/**
 * ==========================================
 * PARALLAX.JS
 * Effet de profondeur
 * ==========================================
 */

class Parallax {

   constructor() {
      
      this.elements =
   
      document.querySelectorAll(".parallax");
   
      this.ticking = false;
   
      this.init();
   }

   update() {
      
      const viewport =
   
      window.innerHeight;

      this.elements.forEach(el => {
   
         const rect = el.getBoundingClientRect();

         const speed = parseFloat(el.dataset.parallaxSpeed) || 0.05;

         let translate = -(rect.top + rect.height / 2 - viewport / 2) * speed;

         translate = Math.max(-80, Math.min(80, translate));

         el.style.transform = `translateY(${translate}px)`;
      }); 
   }


   init() {

      this.update();
      
      window.addEventListener("resize", () => this.update());

      window.addEventListener("scroll", () => {
         
         if (this.ticking) 
            return;
            
         requestAnimationFrame(() => {

            this.update();
               
            this.ticking = false;
            
         });

         this.ticking = true;
         
      },
      
      { passive: true }); 
   }
}