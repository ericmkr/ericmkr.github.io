/**
 * ==========================================
 * MODAL.JS
 * Gestion et affichage des modals
 * ==========================================
 */

class ConfirmationModal {
 
   static show(title = "Message envoyé", message = "Votre message a été envoyé avec succès.") {
        
      const overlay = document.createElement("div");

      overlay.className = "submit-overlay";

      overlay.innerHTML = `
      <div class="submit-modal">          
      <h3>${title}</h3>
      <p>${message}</p>
      <button id="close-modal">
      Fermer
      </button>
      </div>
      `;
  
      document.body.appendChild(overlay);

      const close = () => overlay.remove();

      overlay
      .querySelector("#close-modal")
      .addEventListener("click", close);
      setTimeout(close, 3000); 
   }
}