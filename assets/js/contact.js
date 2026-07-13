/**
 * ==========================================
 * CONTACT.JS
 * Gestion des formulaires
 * ==========================================
 */

const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/victorericmoukouri@outlook.com";

class ContactManager {

   constructor(formId, feedbackId) {

      this.form = document.getElementById(formId);

      this.feedback = document.getElementById(feedbackId);

      if (!this.form) return;

      this.button = this.form.querySelector('button[type="submit"]');
 
      this.cooldown = false;

      this.init();

   }
 
   validate({ name, email, message }) {
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!name)
         
         return "Veuillez entrer votre nom.";

        
      if (!email)
          
         return "Veuillez entrer un email.";
         
      if (!emailRegex.test(email))
         
         return "Email invalide.";

      if (!message)
          
         return "Veuillez entrer un message.";
        
      if (message.length < 5)
            
         return "Message trop court.";

         return null;
       
      }

      async send(data) {
               
         const response =
               
         await fetch(CONTACT_ENDPOINT, {
             
            method: "POST",
                  
            headers: {
              
               "Content-Type":
              
               "application/json",
                                 
               "Accept":
                                  
               "application/json"
                                
            },
                  
            body:JSON.stringify({
                 
               ...data,
                
               _subject:"Nouveau message portfolio",
                    
               _template:"table"
            
            })       
         }      
      );
        
      if (!response.ok)
 
         throw new Error("Erreur réseau");
            
         return response.json();
    
      }

      async handleSubmit(event) {

        event.preventDefault();
 
        if (this.cooldown) 
         
         return;
            
        const data = {
         
         name:this.form.querySelector('[name="name"]').value.trim(),

         email:this.form.querySelector('[name="email"]').value.trim(),

         message:this.form.querySelector('[name="message"]').value.trim()
         
         };

        const error = this.validate(data);

        if (error) {

         this.feedback.textContent = `❌ ${error}`;
   
         return;
        }

        const localId = StorageManager.add(data);

        try {
         
         this.button.disabled = true;

         this.feedback.textContent = "Envoi en cours...";
   
         const result = await this.send(data);
   
         StorageManager.update(localId, {status: "sent", result});
   
         this.feedback.textContent = "✅ Message envoyé";
   
         this.form.reset();

         ConfirmationModal.show();

         this.startCooldown();
      
         } 
         
         catch (error) {

            StorageManager.update(localId, {status: "failed", error: error.message});

            this.feedback.textContent = "❌ Échec de l'envoi";
        
         } 
         
         finally {

            this.button.disabled = false;

         }
      }

      startCooldown() {
         
         this.cooldown = true;

         setTimeout(() => this.cooldown = false, 11000);

      }
    
      init() {this.form.addEventListener("submit", e => this.handleSubmit(e));
         
      }
}