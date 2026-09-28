import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { AffordabilityCalculator } from "@/components/calculator/AffordabilityCalculator";
import { agent } from "@/content/agent";

export const metadata: Metadata = {
  title: "Affordability Calculator",
  description:
    "Estimate your monthly payment and cash to close on any Houston home price.",
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ price?: string }>;
}) {
  const { price } = await searchParams;
  const initialPrice = price ? Number(price) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Plan Ahead"
        title="Affordability Calculator"
        description={`Enter any home price to estimate your monthly payment and cash to close — then get a personalized number directly from ${agent.name}.`}
      />
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <AffordabilityCalculator
          initialPrice={
            initialPrice && Number.isFinite(initialPrice) && initialPrice > 0
              ? initialPrice
              : undefined
          }
        />
      </section>
    </>
  );
}
