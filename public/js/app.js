// Initialize the display element and number pad buttons
const displayDate = document.createElement("div");
displayDate.classList.add("display-date");
displayDate.textContent = "Enter a Date";

const numberPadContainer = document.createElement("div");
numberPadContainer.classList.add("number-pad");
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Clear", "Enter"];

// Populate number pad with buttons
numbers.forEach((num) => {
    const button = document.createElement("button");
    button.textContent = num;
    numberPadContainer.appendChild(button);
});

// Append date display and number pad to the container
document.querySelector(".container").innerHTML = ""; // Clear previous form content
document.querySelector(".container").appendChild(displayDate);
document.querySelector(".container").appendChild(numberPadContainer);

let enteredDate = ""; // Store entered date as a string

// Handle number pad clicks
numberPadContainer.addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;

    const value = event.target.textContent;

    if (value === "Clear") {
        enteredDate = ""; // Clear input
    } else if (value === "Enter") {
        if (enteredDate.length === 8) {
            submitDate(enteredDate); // Trigger date submission if valid
        } else {
            alert("Please enter an 8-digit date (MMDDYYYY).");
        }
    } else if (enteredDate.length < 8) {
        enteredDate += value; // Append digit to entered date
    }

    // Update display with current date entry or prompt
    displayDate.textContent = enteredDate || "Enter a Date";
});

// Submit date to backend
async function submitDate(date) {
    try {
        const response = await fetch(`/api/events/get-event-by-date?date=${date}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const event = await response.json();
            window.location.href = `/display.html?date=${date}&event=${encodeURIComponent(event.name)}`;
        } else {
            alert("No event found for this date. Please try another date.");
        }
    } catch (error) {
        console.error("Error fetching event data:", error);
        alert("An error occurred. Please try again.");
    }
}
