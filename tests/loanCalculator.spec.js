// Importing the 'test' function from the Playwright test runner to define and execute test cases
const { test } = require('@playwright/test');

// Importing the xlsx library for reading and writing Excel files
const xlsx = require('xlsx');

// Importing the path module to handle file paths
const path = require('path');

// Importing the LoanCalculatorPage page object that defines interactions with the Loan Calculator page
const { LoanCalculatorPage } = require('../pages/LoanCalculatorPage');

// Loading the input data from the 'input.xlsx' Excel file located in the '../data/' folder
const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));

// Creating a new workbook to store the test results in an Excel file
const outputWorkbook = xlsx.utils.book_new();

// Utility function to write results to an output Excel file
function writeResults(sheetName, data) {
  // Converts JSON data into a worksheet format
  const worksheet = xlsx.utils.json_to_sheet(data);
  
  // Appends the worksheet with the provided sheet name to the output workbook
  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);
  
  // Writes the output workbook to a file named 'loancalcoutput.xlsx'
  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/loancalcoutput.xlsx'));
}

// ✅ Test Case 1: Loan Calculator UI Validation
test('Loan Calculator UI Validation', async ({ page }) => {
  // Extracts the first row of data from the 'LoanCalculator' sheet in the input Excel file
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
  // Initializes the LoanCalculatorPage class with the current browser page
  const loanCalcPage = new LoanCalculatorPage(page);

  // Navigates to the Loan Calculator page
  await loanCalcPage.navigate();

  // Validates the UI elements on the Loan Calculator page using the extracted input data
  const results = [await loanCalcPage.validateUI(input)];

  // Writes the validation results to the 'LoanCalculator' sheet in the output Excel file
  writeResults('LoanCalculator', results);
});

// ✅ Test Case 2: Tenure Data Validation
test('Tenure data Validation', async ({ page }) => {
  // Extracts the first row of data from the 'LoanCalculator' sheet in the input Excel file
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
  // Initializes the LoanCalculatorPage class with the current browser page
  const loanCalcPage = new LoanCalculatorPage(page);
  
  // Navigates to the Loan Calculator page
  await loanCalcPage.navigate();
  
  // Validates tenure data on the page using the extracted input data
  const results = [await loanCalcPage.validateTenuredata(input)];
  
  // For debugging purposes, logs the validation results to the console
  console.log(results);
  // Optionally write the results to Excel (commented out)
  // writeResults('LoanCalculator', results);
});

// ✅ Test Case 3: Check Scale Change
test('Check Scale Change', async ({ page }) => {
  // Extracts the first row of data from the 'LoanCalculator' sheet in the input Excel file
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
  // Initializes the LoanCalculatorPage class with the current browser page
  const loanCalcPage = new LoanCalculatorPage(page);
  
  // Navigates to the Loan Calculator page
  await loanCalcPage.navigate();
  
  // Checks if scale changes (like loan amounts or other elements) behave correctly
  const results = [await loanCalcPage.scaleChange(input)];
  
  // For debugging purposes, logs the scale change results to the console
  console.log(results);
  // Optionally write the results to Excel (commented out)
  // writeResults('LoanCalculator', results);
});

// ✅ Test Case 4: Check Reuse Validation
test('Check Reuse Validation', async ({ page }) => {
  // Extracts the first row of data from the 'LoanCalculator' sheet in the input Excel file
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
  // Initializes the LoanCalculatorPage class with the current browser page
  const loanCalcPage = new LoanCalculatorPage(page);
  
  // Navigates to the Loan Calculator page
  await loanCalcPage.navigate();
  
  // Validates if previously entered loan data can be reused correctly
  const results = [await loanCalcPage.reuseCheck(input)];
  
  // Logs the reuse validation results to the console
  console.log(results);
  // Optionally write the results to Excel (commented out)
  // writeResults('LoanCalculator', results);
});

// ✅ Test Case 5: Check Loan Amount Change
test('Check Loan Amount Change', async ({ page }) => {
  // Extracts the first row of data from the 'LoanCalculator' sheet in the input Excel file
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
  // Initializes the LoanCalculatorPage class with the current browser page
  const loanCalcPage = new LoanCalculatorPage(page);
  
  // Navigates to the Loan Calculator page
  await loanCalcPage.navigate();
  
  // Checks if changing the loan amount updates the calculations and UI correctly
  const results = [await loanCalcPage.loanAmountChange(input)];
  
  // Logs the loan amount change results to the console
  console.log(results);
  // writeResults('LoanCalculator', results);
});

