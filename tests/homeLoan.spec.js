// Import the 'test' function from the Playwright test library
const { test } = require('@playwright/test');

// Import the xlsx library for reading and writing Excel files
const xlsx = require('xlsx');

// Import the path module to handle file paths
const path = require('path');

// Import the 'HomeLoanPage' class which contains functions to interact with the home loan calculator page
const { HomeLoanPage } = require('../pages/HomeLoanPage');

// Read the input data from the 'input.xlsx' file (located in '../data/input.xlsx')
const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));

// Create a new workbook to store test results
const outputWorkbook = xlsx.utils.book_new();

// Utility function to write the results of a test to an Excel sheet
function writeResults(sheetName, data) {
  // Convert the results data (in JSON format) to a worksheet
  const worksheet = xlsx.utils.json_to_sheet(data);

  // Append the worksheet to the output workbook with the specified sheet name
  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);

  // Write the output workbook to a file named 'homeloanoutput.xlsx'
  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/homeloanoutput.xlsx'));
}

// ✅ Test Case 1: Home Loan EMI Calculator
test('Home Loan EMI Calculator Test', async ({ page }) => {
  // Read the first row of data from the 'HomeLoan' sheet in the input Excel file
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['HomeLoan'])[0];

  // Initialize a new HomeLoanPage object with the Playwright 'page' object (browser page)
  const homeLoanPage = new HomeLoanPage(page);

  // Navigate to the home loan calculator page
  await homeLoanPage.navigate();

  // Fill in the home loan details on the webpage with the data from the input Excel file
  await homeLoanPage.fillHomeLoanDetails(input);

  // Parse the loan tenure in years from the input data
  const tenureYears = parseInt(input['Loan Tenure (Years)']);

  // Extract the yearly EMI breakup for the loan (adding 1 to tenure years)
  const results = await homeLoanPage.extractYearlyBreakup(tenureYears + 1);

  // Write the results to the Excel file under the 'HomeLoan' sheet
  writeResults('HomeLoan', results);
  // Uncomment the line below if you want to log the results to the console
  // console.log(results);
});

// ✅ Test Case 2: Total Interest Visibility
test('Home Loan - Total Interest Check', async ({ page }) => {
  // Initialize a new HomeLoanPage object
  const homeLoanPage = new HomeLoanPage(page);

  // Navigate to the home loan calculator page
  await homeLoanPage.navigate();

  // Fill in the home loan details with hardcoded values for this test case
  await homeLoanPage.fillHomeLoanDetails({
    'Home Value': 2500000,
    'Down Payment (%)': 20,
    'Loan Insurance': 0,
    'Loan Amount': 2000000,
    'Interest Rate': 9,
    'Loan Tenure (Years)': 3,
    'Loan Fees (%)': 1,
    'One-time Expenses (%)': 0,
    'Property Taxes / year (%)': 0,
    'Home Insurance / year (%)': 0,
    'Maintenance Expenses / month': 0
  });

  // Validate if the total interest is visible on the page after entering loan details
  const visible = await homeLoanPage.validateTotalInterest();

  // Log the result to the console (whether total interest is visible or not)
  console.log({ InterestVisible: visible });
});

// ✅ Test Case 3: UI Elements Visibility
test('Home Loan - UI Elements Visibility', async ({ page }) => {
  // Initialize a new HomeLoanPage object
  const homeLoanPage = new HomeLoanPage(page);

  // Navigate to the home loan calculator page
  await homeLoanPage.navigate();

  // Check if the essential UI elements (inputs, buttons, etc.) are visible on the page
  const ui = await homeLoanPage.checkUIElements();

  // Log the result to the console
  console.log(ui);
});

// ✅ Test Case 4: Insurance Impact on Home Loan
test('Home Loan - Insurance Impact', async ({ page }) => {
  // Initialize a new HomeLoanPage object
  const homeLoanPage = new HomeLoanPage(page);

  // Navigate to the home loan calculator page
  await homeLoanPage.navigate();

  // Fill in the home loan details with insurance costs to see its impact
  await homeLoanPage.fillHomeLoanDetails({
    'Home Value': 2000000,
    'Down Payment (%)': 15,
    'Loan Insurance': 5000,
    'Loan Amount': 1500000,
    'Interest Rate': 8.5,
    'Loan Tenure (Years)': 2,
    'Loan Fees (%)': 1,
    'One-time Expenses (%)': 0,
    'Property Taxes / year (%)': 0,
    'Home Insurance / year (%)': 0,
    'Maintenance Expenses / month': 0
  });

  // Extract the yearly EMI breakup considering the insurance impact
  const results = await homeLoanPage.extractYearlyBreakup(3);

  // Write the results to a new Excel sheet named 'InsuranceImpact'
  writeResults('InsuranceImpact', results);
});

// ✅ Test Case 5: Maintenance Impact on Home Loan
test('Home Loan - Maintenance Impact', async ({ page }) => {
  // Initialize a new HomeLoanPage object
  const homeLoanPage = new HomeLoanPage(page);

  // Navigate to the home loan calculator page
  await homeLoanPage.navigate();

  // Fill in the home loan details with maintenance expenses to see its impact
  await homeLoanPage.fillHomeLoanDetails({
    'Home Value': 2200000,
    'Down Payment (%)': 10,
    'Loan Insurance': 0,
    'Loan Amount': 1800000,
    'Interest Rate': 9.2,
    'Loan Tenure (Years)': 4,
    'Loan Fees (%)': 1,
    'One-time Expenses (%)': 0,
    'Property Taxes / year (%)': 0,
    'Home Insurance / year (%)': 0,
    'Maintenance Expenses / month': 1000
  });

  // Extract the yearly EMI breakup considering maintenance expenses impact
  const results = await homeLoanPage.extractYearlyBreakup(5);

  // Write the results to a new Excel sheet named 'MaintenanceImpact'
  writeResults('MaintenanceImpact', results);
});
