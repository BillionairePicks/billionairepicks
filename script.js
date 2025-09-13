// Example: simple welcome log
console.log("Welcome to StatStake! 🚀");
// Utility: fetch & display events
async function loadEvents(sport, containerId) {
  const container = document.getElementById(containerId);

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=${sport}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.events) {
      container.innerHTML = `<p>No ${sport} events today.</p>`;
      return;
    }

    // Build events list
    let html = "<ul>";
    data.events.slice(0, 5).forEach(event => {
      html += `
        <li>
          ${event.strEvent} <br>
          <small>${event.dateEvent} • ${event.strLeague}</small>
        </li>
      `;
    });
    html += "</ul>";

    container.innerHTML = html;
  } catch (err) {
    console.error(`Error loading ${sport} events:`, err);
    container.innerHTML = `<p>Failed to load ${sport} events.</p>`;
  }
}

// Load all sports
loadEvents("Soccer", "live-football");
loadEvents("Basketball", "live-basketball");
loadEvents("Tennis", "live-tennis");
