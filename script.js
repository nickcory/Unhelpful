// Elements
const toggleBtn = document.getElementById("toggle");
const resetBtn = document.getElementById("reset");
const display = document.getElementById("display");
const modeCountdownBtn = document.getElementById("mode-countdown");
const modeStopwatchBtn = document.getElementById("mode-stopwatch");
const modeConversionBtn = document.getElementById("mode-conversion");
const countdownControls = document.getElementById("countdown-controls");
const unitSelect = document.getElementById("unit");
const countdownStopwatchSection = document.getElementById("countdown-stopwatch-section");
const conversionSection = document.getElementById("conversion-table-section");
const convertInput = document.getElementById("convert-seconds");
const convertButton = document.getElementById("convert-button");
const conversionTable = document.getElementById("conversion-table");
const conversionTableBody = conversionTable.querySelector("tbody");

// Timer logic
let interval = null;
let mode = "countdown";
let startTime = null;
let endTime = null;

// Unit conversion rates in seconds
const conversionRates = {
  bananas: 172800,
  sitcom: 1320,
  heartbeat: 0.1,
  halflife: 16531200,
  lightblink: 0.0003,
  beewing: 0.00435,
  pencil: 1620000
};

// Unit label formatting
function formatUnit(unit) {
  const units = {
    bananas: "banana ripenings",
    sitcom: "90's sitcom episodes",
    heartbeat: "mouse heartbeats",
    halflife: "Cobalt-60 half-lives",
    lightblink: "light-blink units",
    beewing: "bee wing flaps",
    pencil: "pencils worn out by writing"
  };
  return units[unit] || unit;
}

// Update the displayed timer value
function updateDisplay(unit) {
  const conversion = conversionRates[unit];
  if (!conversion) return;

  const now = Date.now();
  let seconds = 0;

  if (mode === "stopwatch" && startTime) {
    seconds = (now - startTime) / 1000;
    display.textContent = `${(seconds / conversion).toFixed(2)} ${formatUnit(unit)} elapsed`;
  } else if (mode === "countdown" && endTime) {
    seconds = Math.max(0, (endTime - now) / 1000);
    display.textContent = `${(seconds / conversion).toFixed(2)} ${formatUnit(unit)} remaining`;

    if (seconds <= 0) {
      clearInterval(interval);
      interval = null;
      display.textContent = "Time's up (in some useless unit).";
      toggleBtn.textContent = "Start";
      toggleBtn.classList.remove("stop");
    }
  }
}

// Mode switching
modeCountdownBtn.addEventListener("click", () => {
  mode = "countdown";
  countdownControls.style.display = "block";
  countdownStopwatchSection.style.display = "block";
  conversionSection.style.display = "none";
  display.textContent = "Countdown mode selected.";
});

modeStopwatchBtn.addEventListener("click", () => {
  mode = "stopwatch";
  countdownControls.style.display = "none";
  countdownStopwatchSection.style.display = "block";
  conversionSection.style.display = "none";
  display.textContent = "Stopwatch mode selected.";
});

modeConversionBtn.addEventListener("click", () => {
  countdownStopwatchSection.style.display = "none";
  conversionSection.style.display = "block";
});

// Start/Stop toggle button
toggleBtn.addEventListener("click", () => {
  const unit = unitSelect.value;
  const now = Date.now();

  if (interval) {
    clearInterval(interval);
    interval = null;
    toggleBtn.textContent = "Start";
    toggleBtn.classList.remove("stop");
    return;
  }

  const timeInput = parseInt(document.getElementById("time")?.value);

  if (mode === "countdown") {
    if (!timeInput || timeInput <= 0) {
      display.textContent = "Please enter a valid time in seconds.";
      return;
    }
    startTime = now;
    endTime = now + timeInput * 1000;
  } else if (mode === "stopwatch") {
    startTime = now;
    endTime = null;
  }

  updateDisplay(unit);
  toggleBtn.textContent = "Stop";
  toggleBtn.classList.add("stop");

  interval = setInterval(() => {
    updateDisplay(unitSelect.value);

    if (mode === "countdown" && endTime && Date.now() >= endTime) {
      clearInterval(interval);
      interval = null;
      toggleBtn.textContent = "Start";
      toggleBtn.classList.remove("stop");
    }
  }, 250);
});

// Reset
resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  startTime = null;
  endTime = null;

  display.textContent = "Waiting for action...";
  toggleBtn.textContent = "Start";
  toggleBtn.classList.remove("stop");
});

// Unit change while timer is running
unitSelect.addEventListener("change", () => {
  if (startTime || endTime) {
    updateDisplay(unitSelect.value);
  }
});

// Conversion Table logic
convertButton.addEventListener("click", () => {
  const seconds = parseFloat(convertInput.value);
  if (!seconds || seconds <= 0) {
    alert("Enter a valid number of seconds.");
    return;
  }

  conversionTableBody.innerHTML = "";

  Object.keys(conversionRates).forEach((unitKey) => {
    const value = (seconds / conversionRates[unitKey]).toFixed(4);
    const row = document.createElement("tr");
    const unitCell = document.createElement("td");
    const valueCell = document.createElement("td");

    unitCell.textContent = formatUnit(unitKey);
    valueCell.textContent = value;

    row.appendChild(unitCell);
    row.appendChild(valueCell);
    conversionTableBody.appendChild(row);
  });

  conversionTable.style.display = "table";
});
