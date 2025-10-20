export async function loadAlerts() {
  try {
    const response = await fetch("/json/alerts.json"); 
    if (!response.ok) {
        throw new Error("Failed to fetch alerts.json");
    }
    
    const alerts = await response.json();
    if (!alerts || alerts.length === 0) return;

    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach(alert => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background || "darkblue";
      p.style.color = alert.color || "white";
      p.style.padding = "1rem";
      p.style.margin = "0";
      p.style.textAlign = "center";
      p.style.fontWeight = "bold";
      section.appendChild(p);
    });

    const main = document.querySelector("main");
    if (main) main.prepend(section);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error loading alerts:", err);
  }
}
