/**
 * ==========================================
 * STORAGE.JS
 * Gestion des soumissions locales
 * ==========================================
 */

const StorageManager = {

   KEY: "portfolio_submissions",

   load() {
      
      try {
      
         return JSON.parse(localStorage.getItem(this.KEY)) || [];
      
      }
      
      catch {

         return [];
      
      }
      
   },
 
   save(data) { 

      localStorage.setItem(this.KEY, JSON.stringify(data));
   
   },

   add(payload) {
  
      const submissions = this.load();
  
      const entry = {
         id: crypto.randomUUID(),   
         createdAt: new Date().toISOString(),   
         status: "pending",   
         ...payload  
      };
  
      submissions.push(entry);
  
      this.save(submissions);
      
      return entry.id;
    
   },
 
   update(id, updates) {
  
      const submissions = this.load();

      const updated = submissions.map(item =>
         item.id === id
         ? { ...item, ...updates }
         : item
      );

      this.save(updated);
   }
};