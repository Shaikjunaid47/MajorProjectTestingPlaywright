 class CarLoanPage {
    constructor(page) {
      this.page = page;
      this.loanTab = '#car-loan';
      this.loanAmountInput = '#loanamount';
      this.interestRateInput = '#loaninterest';
      this.loanTenureInput = '#loanterm';
      this.triggerArea = "//label[@for='emischeme']";
      this.clickYear = '//*[@id="year2025"]';
      this.amortizationTable = '#emibreakup tbody tr';
    }
    
    // Method to navigate to the car loan calculator page
    async navigate() {
        // Go to the 'https://emicalculator.net' website
        await this.page.goto('https://emicalculator.net');

        // Click on the 'Loan' tab (assuming this is how you select a car loan section)
        await this.page.click(this.loanTab);
        await this.page.waitForTimeout(2000);
    }

    // Method to fill in loan details: loan amount, interest rate, and tenure
        async fillLoanDetails({ loanAmount, interestRate, tenure }) {
        // Fill the loan amount field with the provided loan amount
        await this.page.fill(this.loanAmountInput, loanAmount.toString());

        // Fill the interest rate field with the provided interest rate
        await this.page.fill(this.interestRateInput, interestRate.toString());

        // Fill the tenure field with the provided loan tenure (in years)
        await this.page.fill(this.loanTenureInput, tenure.toString());

        // Click the trigger area to perform the loan calculation (e.g., a button to calculate EMI)
        await this.page.click(this.triggerArea); 
    }

    // Method to get the breakup of the first month's EMI (Principal and Interest)
    async getFirstMonthBreakup() {
        // Click on the 'Year' tab to expand the loan breakup table (for showing monthly breakdown)
        await this.page.click(this.clickYear);

        // Return an object containing the Month, Principal, and Interest for the first month
        return {
            // Extract the month ('Jul') from the table (or whatever the default month is)
            Month: await this.page.locator("//td[normalize-space()='Jul']").first().textContent(),

            // Extract the Principal payment for the first month from the table
            Principal: await this.page.locator('//*[@id="monthyear2025"]/td/div/table/tbody/tr[1]/td[2]').textContent(),

            // Extract the Interest payment for the first month from the table
            Interest: await this.page.locator('//*[@id="monthyear2025"]/td/div/table/tbody/tr[1]/td[3]').textContent()
        };
    }
zz
    // Method to validate if the EMI calculation is visible on the page
    async validateEMICalculation() {
        // Wait for the EMI total amount element to be visible on the page
        await this.page.waitForSelector('#emitotalamount');

        // Return whether the EMI total amount element is visible on the page
        return await this.page.locator('#emitotalamount').isVisible();
    }

    // Method to check if key UI elements (Loan Amount, Interest Rate, Tenure) are visible
    async checkUIElements() {
        // Return an object with the visibility status of the key UI elements (input fields)
        return {
            // Check if the loan amount input field is visible on the page
            loanAmountVisible: await this.page.locator(this.loanAmountInput).isVisible(),

            // Check if the interest rate input field is visible on the page
            interestRateVisible: await this.page.locator(this.interestRateInput).isVisible(),

            // Check if the tenure input field is visible on the page
            tenureVisible: await this.page.locator(this.loanTenureInput).isVisible()
        };
    }
}

// Export the CarLoanPage class to be used in test scripts
module.exports = { CarLoanPage };
