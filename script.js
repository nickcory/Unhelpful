const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const display = document.getElementById("display");
const modeCountdownBtn = document.getElementById("mode-countdown");
const modeStopwatchBtn = document.getElementById("mode-stopwatch");
const countdownControls = document.getElementById("countdown-controls");

let interval = null;
let mode = "countdown"; // or 'stopwatch'

const conversionRates = {
  bananas: 172800, // seconds
  sitcoms: 1320,
  heartbeat: 0.1,
  halflife: 16531200,
  lightblink: 0.0003,
  bee: 0.00435,
  pencils: 1620000, 
};

function formatUnit(unit) {
  const units = {
    bananas: "banana ripenings",
    sitcoms: "90's Sitcom Episodes",
    heartbeat: "mouse heartbeats",
    halflife: "Cobalt-60 half-lives",
    lightblink: "light-blink units",
    bee: "Bee wing flaps",
    pencils: "Pencils worn out by writing"
  };
  return units[unit] || unit;
}

modeCountdownBtn.addEventListener("click", () => {
  mode = "countdown";
  countdownControls.style.display = "block";
  display.textContent = "Countdown mode selected.";
});

modeStopwatchBtn.addEventListener("click", () => {
  mode = "stopwatch";
  countdownControls.style.display = "none";
  display.textContent = "Stopwatch mode selected.";
});

startBtn.addEventListener("click", () => {
  const unit = document.getElementById("unit").value;
  const conversion = conversionRates[unit];

  if (!conversion) {
    display.textContent = "Please select a ridiculous unit.";
    return;
  }

  let startTime = Date.now();
  let endTime = startTime + (parseInt(document.getElementById("time")?.value) || 0) * 1000;

  stopBtn.style.display = "inline-block";

  if (interval) clearInterval(interval);

  if (mode === "countdown") {
    interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, (endTime - now) / 1000);
      const unhelpful = (remaining / conversion).toFixed(2);

      display.textContent = `${unhelpful} ${formatUnit(unit)} remaining`;

      if (remaining <= 0) {
        clearInterval(interval);
        display.textContent = "Time's up (in some useless unit).";
        stopBtn.style.display = "none";
      }
    }, 250);
  } else if (mode === "stopwatch") {
    interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const unhelpful = (elapsed / conversion).toFixed(2);

      display.textContent = `${unhelpful} ${formatUnit(unit)} elapsed`;
    }, 250);
  }
});

stopBtn.addEventListener("click", () => {
  clearInterval(interval);
  display.textContent += " (Stopped)";
  stopBtn.style.display = "none";
});
