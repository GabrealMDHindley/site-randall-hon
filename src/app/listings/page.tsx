import type { Metadata } from "next";
import { listings } from "@/content/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { agent } from "@/content/agent";

export const metadata: Metadata = {
  title: "Listings",
  description: `Current listings from ${agent.name}, ${agent.title} with ${agent.brokerage} in Houston, TX.`,
};

export default function ListingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Inventory"
        title="Listings"
        description="Every home listed below is presented with its real details, exactly as provided."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        {listings.length > 0 ? (
          <StaggerGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <StaggerItem key={listing.slug}>
                <ListingCard listing={listing} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title="Inventory is being updated"
            description={`${agent.name}'s current listings are being added to this site. Reach out directly for available homes today, or check back shortly.`}
            action={
              <ButtonLink href="/contact" variant="filled">
                Contact Randall
              </ButtonLink>
            }
          />
        )}
      </section>
    </>
  );
}
