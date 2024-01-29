const display = document.getElementById("display");
console.log(typeof display);
let currentExpression = "";
let lastOperator = null;
const record = document.querySelector(".records");
const btnVal = document.querySelectorAll(".btnVal");

function appendValue(value) {
  // Check for valid input.
  if (!validInput(value)) return;

  // Multiple decimal point check.
  if (value === ".") {
    for (let i = currentExpression.length - 1; i >= 0; i--) {
      if (
        currentExpression[i] === "+" ||
        currentExpression[i] === "-" ||
        currentExpression[i] === "*" ||
        currentExpression[i] === "/"
      ) {
        // This checks the 2nd part of the expression. currentExpression = [ 123 + 23 ] --> str = 23.
        let str = currentExpression.slice(i + 1);
        if (str.includes(".")) {
          return;
        }

        //If it doesn't include decimal then add.
        else {
          currentExpression += value;
          display.textContent = currentExpression;
        }
      }
    }

    // If there is no 2nd part to the currentExpression then check the currentExpression for decimal.
    if (currentExpression.includes(".")) {
      return;
    }
  }

  // Check whether the first value is '* or /' and restricting it.
  if (lastOperator === null && (value === "*" || value === "/")) return;

  // Check whether the first value is '* or /' and restricting it.
  if (currentExpression === "" && (value === "*" || value === "/")) return;

  if (
    currentExpression === "" &&
    (value === "+" || value === "-" || value === ".")
  ) {
    currentExpression = value;
  } else {
    currentExpression += value;
  }

  lastOperator = value;
  display.textContent = currentExpression;
}

// To calculate the result.
function Calculate() {
  if (currentExpression === "") return;

  try {
    currentExpression = eval(currentExpression);
    let roundedResult = Math.round(currentExpression * 100) / 100;
    currentExpression = roundedResult.toString();
    lastOperator = null;
    display.textContent = currentExpression;

    // Calling 'Store' function to store the result to the localstorage.
    Store(currentExpression);
  } catch (error) {
    display.textContent = "Error";
  }
}

function Clear() {
  currentExpression = "";
  lastOperator = null;
  display.textContent = "0";
}

function Backspace() {
  currentExpression = currentExpression.slice(0, -1);
  lastOperator = currentExpression.charAt(currentExpression.length - 1);
  display.textContent = currentExpression || "0";
}

function validInput(value) {
  // Check for speacial non arthemetic characters.
  if (/[!@#$%^&()_]/.test(value)) return false;

  // Check for replacing consecutive operator with the last one.
  if (lastOperator && isOperator(lastOperator) && isOperator(value)) {
    currentExpression = currentExpression.slice(0, -1);
  }
  return true;
}

// Check if the input value is an operator.
function isOperator(value) {
  return /[\+\-\*\/]/.test(value);
}

// Stores the calculations in the localstorage.
function Store(calculation) {
  let calculations = JSON.parse(localStorage.getItem("calculations")) || [];
  calculations.unshift(calculation);

  if (calculations.length > 5) {
    calculations.pop();
  }

  localStorage.setItem("calculations", JSON.stringify(calculations));
}

// To show the calculations stored in the localstorage.
function History() {
  console.log(localStorage.getItem("calculations"));
  let calculations = JSON.parse(localStorage.getItem("calculations")) || [];
  record.textContent = `Records: ${calculations}`;
}

// Event listener to handle keyboard inputs.
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "Enter" || key === "Return") {
    Calculate();
  } else if (key === "Delete") {
    Clear();
  } else if (key === "Backspace") {
    Backspace();
  } else if (
    key === "0" ||
    (key >= "1" && key <= "9") ||
    key === "." ||
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/"
  ) {
    appendValue(key);
  }
});
