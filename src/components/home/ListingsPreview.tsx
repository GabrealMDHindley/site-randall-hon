import { listings } from "@/content/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function ListingsPreview() {
  const preview = listings.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Current Inventory</SectionEyebrow>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl text-paper sm:text-4xl">
              Featured Listings
            </h2>
          </Reveal>
        </div>
        {preview.length > 0 && (
          <ButtonLink href="/listings" variant="outline">
            All Listings
          </ButtonLink>
        )}
      </div>

      {preview.length > 0 ? (
        <StaggerGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((listing) => (
            <StaggerItem key={listing.slug}>
              <ListingCard listing={listing} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="mt-12">
          <EmptyState
            title="Inventory is being updated"
            description="New listings will appear here the moment they're added. In the meantime, contact Randall directly for current availability."
            action={
              <ButtonLink href="/contact" variant="filled">
                Contact Randall
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  );
}
