/**
 * ==========================================
 * ANIMATIONS.JS
 * Animations au scroll
 * ==========================================
 */

class ScrollAnimations {
 
   static init() {

      const observer = new IntersectionObserver(

         entries => {
   
            entries.forEach(entry => {

               if (!entry.isIntersecting)
               return;
   
               entry.target.classList.add("in-view");
               
               observer.unobserve(entry.target);
            });
         },

         {
         
            threshold: 0.12
         
         }         
      );
      
      document.querySelectorAll(".animate-fade")
      
      .forEach(el => observer.observe(el));

   }

}


// ===== SIMPLE PROGRESS ANIMATION =====

const progressBars = document.querySelectorAll(".progress");

window.addEventListener("load", () => {

  progressBars.forEach(bar => {

    const width = bar.style.width;

    bar.style.width = "0";

    setTimeout(() => {
      bar.style.width = width;
      bar.style.transition = "1.2s ease";
    }, 200);

  });

});