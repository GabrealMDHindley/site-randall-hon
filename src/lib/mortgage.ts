// Affordability calculator math. Every figure here is a clearly-labeled ESTIMATE —
// this is a lead tool, not a loan offer. Defaults are reasonable Texas/Harris-County
// ballparks and are always user-editable.

export interface MortgageInputs {
  price: number;
  downPaymentPercent: number;
  interestRate: number; // annual %, e.g. 6.75
  termYears: number; // 15 | 30
  propertyTaxRate: number; // annual %, e.g. 2.1
  annualInsurance: number; // dollars/year
  hoaMonthly: number; // dollars/month
}

export interface MortgageBreakdown {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthly: number;
  estimatedClosingCosts: number;
  estimatedCashToClose: number;
}

export const DEFAULT_MORTGAGE_INPUTS: Omit<MortgageInputs, "price"> = {
  downPaymentPercent: 20,
  interestRate: 6.75,
  termYears: 30,
  propertyTaxRate: 2.1, // typical effective rate, Harris County — varies by taxing entity
  annualInsurance: 0, // derived from price by default, see estimateAnnualInsurance
  hoaMonthly: 0,
};

/** Rough homeowners-insurance ballpark: ~0.35% of home price per year. Editable in the UI. */
export function estimateAnnualInsurance(price: number): number {
  return Math.round((price * 0.0035) / 10) * 10;
}

export function calculateMortgage(inputs: MortgageInputs): MortgageBreakdown {
  const price = Math.max(0, inputs.price || 0);
  const downPaymentAmount = price * (inputs.downPaymentPercent / 100);
  const loanAmount = Math.max(0, price - downPaymentAmount);

  const monthlyRate = inputs.interestRate / 100 / 12;
  const numPayments = inputs.termYears * 12;

  let monthlyPrincipalInterest = 0;
  if (loanAmount > 0) {
    if (monthlyRate === 0) {
      monthlyPrincipalInterest = loanAmount / numPayments;
    } else {
      const factor = Math.pow(1 + monthlyRate, numPayments);
      monthlyPrincipalInterest = (loanAmount * monthlyRate * factor) / (factor - 1);
    }
  }

  const monthlyTax = (price * (inputs.propertyTaxRate / 100)) / 12;
  const monthlyInsurance = inputs.annualInsurance / 12;
  const monthlyHOA = inputs.hoaMonthly;

  const totalMonthly =
    monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyHOA;

  // Closing costs ballpark for a buyer in Texas: ~2.5% of price, excluding the down payment.
  const estimatedClosingCosts = price * 0.025;
  const estimatedCashToClose = downPaymentAmount + estimatedClosingCosts;

  return {
    loanAmount,
    downPaymentAmount,
    monthlyPrincipalInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyHOA,
    totalMonthly,
    estimatedClosingCosts,
    estimatedCashToClose,
  };
}
