"use client";

import { useMemo, useState } from "react";
import {
  calculateMortgage,
  DEFAULT_MORTGAGE_INPUTS,
  estimateAnnualInsurance,
} from "@/lib/mortgage";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

interface AffordabilityCalculatorProps {
  initialPrice?: number;
  listingSlug?: string;
  compact?: boolean;
}

function Field({
  label,
  value,
  suffix,
  children,
}: {
  label: string;
  value: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-xs uppercase tracking-[0.15em] text-muted">
          {label}
        </label>
        <span className="font-tabular text-sm text-brass">
          {value}
          {suffix}
        </span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function AffordabilityCalculator({
  initialPrice = 350000,
  listingSlug,
  compact = false,
}: AffordabilityCalculatorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    DEFAULT_MORTGAGE_INPUTS.downPaymentPercent,
  );
  const [interestRate, setInterestRate] = useState(
    DEFAULT_MORTGAGE_INPUTS.interestRate,
  );
  const [termYears, setTermYears] = useState<15 | 30>(
    DEFAULT_MORTGAGE_INPUTS.termYears as 15 | 30,
  );
  const [propertyTaxRate, setPropertyTaxRate] = useState(
    DEFAULT_MORTGAGE_INPUTS.propertyTaxRate,
  );
  // Insurance auto-tracks price until the visitor edits it directly — derived
  // during render rather than mirrored into its own effect-synced state.
  const [manualAnnualInsurance, setManualAnnualInsurance] = useState<number | null>(
    null,
  );
  const [hoaMonthly, setHoaMonthly] = useState(DEFAULT_MORTGAGE_INPUTS.hoaMonthly);

  // Re-sync when the caller passes a new price (e.g. browsing between listing
  // pages that share this component instance) — adjusted during render, the
  // React-documented pattern for resetting state when a prop value changes.
  const [renderedInitialPrice, setRenderedInitialPrice] = useState(initialPrice);
  if (initialPrice !== renderedInitialPrice) {
    setRenderedInitialPrice(initialPrice);
    setPrice(initialPrice);
    setManualAnnualInsurance(null);
  }

  const annualInsurance = manualAnnualInsurance ?? estimateAnnualInsurance(price);

  const result = useMemo(
    () =>
      calculateMortgage({
        price,
        downPaymentPercent,
        interestRate,
        termYears,
        propertyTaxRate,
        annualInsurance,
        hoaMonthly,
      }),
    [price, downPaymentPercent, interestRate, termYears, propertyTaxRate, annualInsurance, hoaMonthly],
  );

  const contactHref = `/contact?reason=calculator&price=${Math.round(price)}&monthly=${Math.round(
    result.totalMonthly,
  )}${listingSlug ? `&listing=${encodeURIComponent(listingSlug)}` : ""}`;

  return (
    <div className={compact ? "" : "grid gap-10 lg:grid-cols-2 lg:gap-16"}>
      <div className="space-y-7">
        <Field label="Home Price" value={formatCurrency(price)}>
          <input
            type="range"
            min={75000}
            max={2500000}
            step={5000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-[#c6a15b]"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="mt-2 w-full border border-line bg-ground-deep px-3 py-2 text-sm text-paper focus:border-brass focus:outline-none"
          />
        </Field>

        <Field
          label="Down Payment"
          value={`${downPaymentPercent}%`}
          suffix={` · ${formatCurrency(result.downPaymentAmount)}`}
        >
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-[#c6a15b]"
          />
        </Field>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Interest Rate" value={`${interestRate}%`}>
            <input
              type="number"
              step={0.125}
              min={0}
              max={15}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
              className="w-full border border-line bg-ground-deep px-3 py-2 text-sm text-paper focus:border-brass focus:outline-none"
            />
          </Field>

          <Field label="Loan Term" value={`${termYears} yrs`}>
            <div className="flex gap-2">
              {[30, 15].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setTermYears(term as 15 | 30)}
                  className={`flex-1 border px-3 py-2 text-sm transition-colors ${
                    termYears === term
                      ? "border-brass bg-brass text-ground"
                      : "border-line text-paper/70 hover:border-brass/50"
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Property Tax" value={`${propertyTaxRate}%`}>
            <input
              type="number"
              step={0.1}
              min={0}
              max={5}
              value={propertyTaxRate}
              onChange={(e) => setPropertyTaxRate(Number(e.target.value) || 0)}
              className="w-full border border-line bg-ground-deep px-3 py-2 text-sm text-paper focus:border-brass focus:outline-none"
            />
          </Field>

          <Field label="Annual Insurance" value={formatCurrency(annualInsurance)}>
            <input
              type="number"
              step={50}
              min={0}
              value={annualInsurance}
              onChange={(e) => setManualAnnualInsurance(Number(e.target.value) || 0)}
              className="w-full border border-line bg-ground-deep px-3 py-2 text-sm text-paper focus:border-brass focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Monthly HOA (optional)" value={formatCurrency(hoaMonthly)}>
          <input
            type="number"
            step={10}
            min={0}
            value={hoaMonthly}
            onChange={(e) => setHoaMonthly(Number(e.target.value) || 0)}
            className="w-full border border-line bg-ground-deep px-3 py-2 text-sm text-paper focus:border-brass focus:outline-none"
          />
        </Field>
      </div>

      <div className="border border-brass/30 bg-surface p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Estimated Monthly Payment
        </p>
        <p className="mt-2 font-tabular font-display text-5xl text-brass">
          {formatCurrency(result.totalMonthly)}
          <span className="text-base text-muted">/mo</span>
        </p>

        <dl className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-paper/70">Principal &amp; Interest</dt>
            <dd className="font-tabular text-paper">
              {formatCurrency(result.monthlyPrincipalInterest)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-paper/70">Property Tax</dt>
            <dd className="font-tabular text-paper">{formatCurrency(result.monthlyTax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-paper/70">Insurance</dt>
            <dd className="font-tabular text-paper">
              {formatCurrency(result.monthlyInsurance)}
            </dd>
          </div>
          {hoaMonthly > 0 && (
            <div className="flex justify-between">
              <dt className="text-paper/70">HOA</dt>
              <dd className="font-tabular text-paper">{formatCurrency(result.monthlyHOA)}</dd>
            </div>
          )}
        </dl>

        <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-paper/70">Loan Amount</dt>
            <dd className="font-tabular text-paper">{formatCurrency(result.loanAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-paper/70">Est. Closing Costs</dt>
            <dd className="font-tabular text-paper">
              {formatCurrency(result.estimatedClosingCosts)}
            </dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt className="text-paper">Est. Cash to Close</dt>
            <dd className="font-tabular text-brass">
              {formatCurrency(result.estimatedCashToClose)}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Estimates only, not a loan offer. Actual rate, taxes, insurance, and
          closing costs vary by lender and property (based on{" "}
          {formatNumber(price)} at {interestRate}%). For an accurate number,
          contact Randall or your lender.
        </p>

        <div className="mt-6">
          <ButtonLink href={contactHref} variant="filled" className="w-full">
            Get a Personalized Number
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
