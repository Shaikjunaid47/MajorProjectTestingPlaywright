
const { test } = require('@playwright/test');


const xlsx = require('xlsx');

const path = require('path');


const { LoanCalculatorPage } = require('../pages/LoanCalculatorPage');


const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));


const outputWorkbook = xlsx.utils.book_new();


function writeResults(sheetName, data) {

  const worksheet = xlsx.utils.json_to_sheet(data);
  
 
  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);
  
 
  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/loancalcoutput.xlsx'));
}

// ✅ Test Case 1: Loan Calculator UI Validation
test('Loan Calculator UI Validation', async ({ page }) => {
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  

  const loanCalcPage = new LoanCalculatorPage(page);

 
  await loanCalcPage.navigate();

 
  const results = [await loanCalcPage.validateUI(input)];

  
  writeResults('LoanCalculator', results);
});

// ✅ Test Case 2: Tenure Data Validation
test('Tenure data Validation', async ({ page }) => {

  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  

  const loanCalcPage = new LoanCalculatorPage(page);
  

  await loanCalcPage.navigate();
  

  const results = [await loanCalcPage.validateTenuredata(input)];
  

  console.log(results);
});

// ✅ Test Case 3: Check Scale Change
test('Check Scale Change', async ({ page }) => {
 
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
 
  const loanCalcPage = new LoanCalculatorPage(page);

  await loanCalcPage.navigate();
  
  
  const results = [await loanCalcPage.scaleChange(input)];
  

  console.log(results);
 
});

// ✅ Test Case 4: Check Reuse Validation
test('Check Reuse Validation', async ({ page }) => {
 
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
  const loanCalcPage = new LoanCalculatorPage(page);
  
 
  await loanCalcPage.navigate();
  

  const results = [await loanCalcPage.reuseCheck(input)];
  
 
  console.log(results);
 
});

// ✅ Test Case 5: Check Loan Amount Change
test('Check Loan Amount Change', async ({ page }) => {
 
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  
  
  const loanCalcPage = new LoanCalculatorPage(page);
  
  await loanCalcPage.navigate();
  
  const results = [await loanCalcPage.loanAmountChange(input)];
  

  console.log(results);
  
});

