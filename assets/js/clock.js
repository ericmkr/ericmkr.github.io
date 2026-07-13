/**
 * ==========================================
 * CLOCK.JS
 * Affichage de l'horloge
 * ==========================================
 */

function updateClock() {

  const now = new Date();

  // Heure
  const hours = String(now.getHours()).padStart(2, "0");

  const minutes = String(now.getMinutes()).padStart(2, "0");
  
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Date
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  // Injection HTML
  document.getElementById("time").textContent = `${hours}:${minutes}:${seconds}`;
  
  document.getElementById("date").textContent = now.toLocaleDateString("fr-FR", dateOptions);
}

// lancement immédiat
updateClock();

// update chaque seconde
setInterval(updateClock, 1000);



// ===== DAYTIME WITH ICONS =====

// function getDayPeriod(hour){

//   if(hour >= 5 && hour < 12){
//     return "morning";
//   }

//   if(hour >= 12 && hour < 18){
//     return "afternoon";
//   }

//   if(hour >= 18 && hour < 21){
//     return "evening";
//   }

//   return "night";
// }