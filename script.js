const calculator = {
  displayValue: "0",
  calculationValue: "",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function updateDisplay() {
  const display = document.querySelector(".calculator-screen");
  display.value = calculator.displayValue;
  const calculationDisplay = document.querySelector(".calculation-screen");
  calculationDisplay.value = calculator.calculationValue;
}

updateDisplay();

const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
  const { target } = event;
  const { value } = target;
  if (!target.matches("button")) {
    return;
  }

  switch (value) {
    case "+":
    case "-":
    case "*":
    case "/":
      handleOperator(value);
      break;
    case "=":
      handleOperator(value);
      break;
    case ".":
      inputDecimal(value);
      break;
    case "all-clear":
      resetCalculator();
      break;
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }

  updateDisplay();
});

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue =
      displayValue === "0" ? digit : displayValue + digit;
  }

  calculator.calculationValue += digit;
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = "0.";
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }

  calculator.calculationValue += dot;
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    calculator.calculationValue =
      calculator.calculationValue.slice(0, -1) + nextOperator;
    return;
  }

  if (firstOperand == null) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const currentValue = firstOperand || 0;
    const result = performCalculation[operator](currentValue, inputValue);

    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
  calculator.calculationValue += nextOperator;
}

const performCalculation = {
  "/": (firstOperand, secondOperand) => firstOperand / secondOperand,
  "*": (firstOperand, secondOperand) => firstOperand * secondOperand,
  "+": (firstOperand, secondOperand) => firstOperand + secondOperand,
  "-": (firstOperand, secondOperand) => firstOperand - secondOperand,
  "=": (firstOperand, secondOperand) => secondOperand,
};

function resetCalculator() {
  calculator.displayValue = "0";
  calculator.calculationValue = "";
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

// Select the elements
const calculationScreen = document.querySelector(".calculation-screen");
const calculatorScreen = document.querySelector(".calculator-screen");

// Listen for button clicks
keys.addEventListener("click", (event) => {
  const { target } = event;
  const { value } = target;

  if (!target.matches("button")) {
    return;
  }

  switch (value) {
    case "+":
    case "-":
    case "*":
    case "/":
      calculationScreen.value += ` ${value} `;
      break;
    case "=":
      try {
        calculatorScreen.value = eval(calculationScreen.value);
      } catch {
        calculatorScreen.value = "Error";
      }
      break;
    case "all-clear":
      calculationScreen.value = "";
      calculatorScreen.value = "";
      break;
    case "clear":
      calculatorScreen.value = ""; // Clear only the result screen
      break;
    case ".":
      calculationScreen.value += value;
      break;
    default:
      calculationScreen.value += value;
      break;
  }
});

// Listen for keyboard input
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key === ".") {
    calculationScreen.value += key;
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    calculationScreen.value += ` ${key} `;
  } else if (key === "Enter" || key === "=") {
    try {
      calculatorScreen.value = eval(calculationScreen.value);
    } catch {
      calculatorScreen.value = "Error";
    }
  } else if (key === "Backspace") {
    calculationScreen.value = calculationScreen.value.slice(0, -1);
  } else if (key === "Escape") {
    calculationScreen.value = "";
    calculatorScreen.value = "";
  }
});
