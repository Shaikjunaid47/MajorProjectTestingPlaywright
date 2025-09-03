const { test } = require('@playwright/test');


const xlsx = require('xlsx');


const path = require('path');


const { CarLoanPage } = require('../pages/CarLoanPage');


const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));

const outputWorkbook = xlsx.utils.book_new();

function writeResults(sheetName, data) {
  // Convert JSON data into a worksheet
  const worksheet = xlsx.utils.json_to_sheet(data);


  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);


  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/caroutput.xlsx'));
}

// ✅ Test Case 1: Car Loan Calculator - First Month Breakdown
test('Car Loan Calculator - First Month Breakdown', async ({ page }) => {
  // Reading the first row of 'CarLoan' sheet from the input Excel as test input
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['CarLoan'])[0];

  // Initializing the CarLoanPage object with the browser page
  const carLoanPage = new CarLoanPage(page);

  // Navigate to the car loan calculator web page
  await carLoanPage.navigate();

  // Fill in loan details from the Excel input
  await carLoanPage.fillLoanDetails({
    loanAmount: input['Loan Amount'],
    interestRate: input['Interest Rate'],
    tenure: input['Loan Tenure (Years)']
  });

  // Fetch the breakdown for the first month's EMI
  const firstMonthData = await carLoanPage.getFirstMonthBreakup();

  // Write the result to the output Excel under the 'CarLoan' sheet
  writeResults('CarLoan', [firstMonthData]);
});

// ✅ Test Case 2: Basic EMI visibility check for hardcoded inputs
test('Car Loan - EMI Calculation Check', async ({ page }) => {
  // Create page object instance
  const carLoanPage = new CarLoanPage(page);

  // Open the car loan page
  await carLoanPage.navigate();

  // Fill in sample loan details
  await carLoanPage.fillLoanDetails({ loanAmount: 1000000, interestRate: 8.5, tenure: 2 });

  // Validate whether EMI is displayed after calculation
  const visible = await carLoanPage.validateEMICalculation();

  // Log result in console
  console.log({ EMIVisible: visible });
});

// ✅ Test Case 3: UI validation - Check presence of essential UI elements
// test('Car Loan - UI Elements Visibility', async ({ page }) => {
//   const carLoanPage = new CarLoanPage(page);

//   // Navigate to the page
//   await carLoanPage.navigate();

//   // Check if expected UI elements (buttons, inputs, etc.) are visible
//   const ui = await carLoanPage.checkUIElements();

//   // Log UI check result
//   console.log(ui);
// });

// ✅ Test Case 4: Test loan calculation with a different tenure
test('Car Loan - Different Tenure', async ({ page }) => {
  const carLoanPage = new CarLoanPage(page);

  // Navigate to loan calculator page
  await carLoanPage.navigate();

  // Fill in alternate loan data with different tenure
  await carLoanPage.fillLoanDetails({ loanAmount: 500000, interestRate: 7.5, tenure: 5 });

  // Retrieve first month breakdown
  const result = await carLoanPage.getFirstMonthBreakup();

  // Output result to console
  console.log(result);
});

// ✅ Test Case 5: Edge case testing with very small input values
test('Car Loan - Edge Case Input', async ({ page }) => {
  const carLoanPage = new CarLoanPage(page);

  // Open the car loan calculator page
  await carLoanPage.navigate();

  // Enter minimum/edge values for loan input
  await carLoanPage.fillLoanDetails({ loanAmount: 1, interestRate: 0.1, tenure: 1 });

  // Retrieve EMI breakdown for edge input
  const result = await carLoanPage.getFirstMonthBreakup();

  // Print the result to console
  console.log(result);
});