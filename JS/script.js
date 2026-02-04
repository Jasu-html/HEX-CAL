/* SOUND EFFECTS */
function playSound(id) {
  const s = document.getElementById(id);
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}

/* DISPLAY */
const display = document.getElementById("display");

/* STATE */
let current = "";
let previous = null;
let errorTimeout = null; // timer for error messages

/* ERROR HANDLING */
function showError(message) {
  // Clear any existing error timeout
  if (errorTimeout) clearTimeout(errorTimeout);

  display.value = message;
  playSound("sfx-error");

  // After 2 seconds, clear the display and reset state
  errorTimeout = setTimeout(() => {
    display.value = "";
    current = "";
    previous = null;
    errorTimeout = null;
  }, 2000);
}

/* UPDATE DISPLAY */
function updateDisplay() {
  if (errorTimeout) return; // don't overwrite error while showing
  display.value = current || "";
}

/* NUMBER + HEX BUTTONS (0–9, A–F) */
document.querySelectorAll(".num, .hex").forEach(btn => {
  btn.onclick = () => {
    current += btn.textContent.toUpperCase();
    updateDisplay();
    playSound("sfx-click");
  };
});

/* ADD BUTTON (+) */
document.querySelector(".op").onclick = () => {
  if (current === "") {
    showError("Enter a number first!");
    return;
  }
  previous = current;
  current = "";
  playSound("sfx-click");
};

/* CLEAR ONE (C) */
document.querySelectorAll(".func")[1].onclick = () => {
  if (current === "") {
    playSound("sfx-error");
    return;
  }
  current = current.slice(0, -1);
  updateDisplay();
  playSound("sfx-click");
};

/* ALL CLEAR (AC) */
document.querySelectorAll(".func")[0].onclick = () => {
  current = "";
  previous = null;
  updateDisplay();
  playSound("sfx-click");
};

/* EQUALS (=) */
document.querySelector(".equal").onclick = () => {
  if (previous === null && current === "") {
    showError("Enter numbers first!");
    return;
  }
  if (previous === null) {
    showError("Press an operator first!");
    return;
  }
  if (current === "") {
    showError("Enter second number!");
    return;
  }

  // Parse hex numbers and add
  const num1 = parseInt(previous, 16);
  const num2 = parseInt(current, 16);
  const result = num1 + num2;

  current = result.toString(16).toUpperCase();
  updateDisplay();

  previous = null; // ready for next calculation
  playSound("sfx-equals");
};
