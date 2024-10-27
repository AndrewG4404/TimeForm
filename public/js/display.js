document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");
    const location = urlParams.get("location");

    // Load sound for time-travel effect
    const timeTravelSound = document.getElementById("time-travel-sound");

    if (!eventId) {
        document.getElementById("event-name").textContent = "No event details available.";
        return;
    }

    try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Event not found");

        const eventData = await response.json();

        // Populate the event details on the page
        document.getElementById("event-name").textContent = eventData.eventName || "Unknown Event";
        document.getElementById("location").textContent = eventData.location || "Unknown";
        document.getElementById("person-name").textContent = eventData.personName || "Unknown";
        document.getElementById("start-date").textContent = eventData.startDate || "N/A";
        document.getElementById("end-date").textContent = eventData.endDate || "N/A";
        document.getElementById("related-events").textContent = eventData.relatedEvents || "None";

        // Initialize the map with location if available
        initMap(eventData.location);

        // Play sound effect when details are loaded
        timeTravelSound.play();
    } catch (error) {
        console.error("Error fetching event details:", error);
        document.getElementById("event-name").textContent = "Error loading event details.";
    }
});

function initMap(location) {
    const geocoder = new google.maps.Geocoder();
    const mapElement = document.getElementById("map");

    if (location) {
        geocoder.geocode({ address: location }, (results, status) => {
            if (status === "OK" && results[0]) {
                const map = new google.maps.Map(mapElement, {
                    zoom: 12,
                    center: results[0].geometry.location,
                    styles: [{ elementType: 'geometry', stylers: [{ color: '#202c3e' }] }]
                });
                new google.maps.Marker({
                    position: results[0].geometry.location,
                    map,
                    title: location,
                    icon: {
                        url: "path/to/retro-icon.png",
                        scaledSize: new google.maps.Size(30, 30)
                    }
                });
            } else {
                console.error("Geocode was not successful:", status);
            }
        });
    } else {
        console.warn("No location provided to map.");
    }
}
