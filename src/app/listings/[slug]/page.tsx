import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, MapPin } from "lucide-react";
import { listings } from "@/content/listings";
import { agent } from "@/content/agent";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { AffordabilityCalculator } from "@/components/calculator/AffordabilityCalculator";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = listings.find((l) => l.slug === slug);
  if (!listing) return {};

  return {
    title: `${listing.address}, ${listing.city} — ${formatCurrency(listing.price)}`,
    description: listing.description.slice(0, 155),
    openGraph: listing.photos[0]
      ? { images: [`/listings/${listing.slug}/${listing.photos[0]}`] }
      : undefined,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = listings.find((l) => l.slug === slug);
  if (!listing) notFound();

  return (
    <>
      <div className="pt-28 lg:pt-32" />

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <span className="border border-brass/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-brass">
            {listing.status}
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl text-paper sm:text-5xl">
            {listing.address}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <MapPin size={14} />
            {listing.city}, {listing.state} {listing.zip}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-8">
            <p className="font-tabular font-display text-4xl text-brass">
              {formatCurrency(listing.price)}
            </p>
            <div className="flex items-center gap-6 text-sm text-paper/80">
              <span className="flex items-center gap-2">
                <Bed size={16} /> {listing.beds} Beds
              </span>
              <span className="flex items-center gap-2">
                <Bath size={16} /> {listing.baths} Baths
              </span>
              <span className="flex items-center gap-2">
                <Ruler size={16} /> {formatNumber(listing.sqft)} sqft
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-6 lg:px-10">
        <Reveal>
          <ListingGallery
            slug={listing.slug}
            address={listing.address}
            photos={listing.photos}
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <Reveal>
          <h2 className="font-display text-2xl text-paper">Description</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-paper/80">
            {listing.description}
          </p>
        </Reveal>

        {listing.features.length > 0 && (
          <Reveal delay={0.1}>
            <h3 className="mt-10 font-display text-xl text-paper">Features</h3>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {listing.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-paper/75"
                >
                  <span className="h-1 w-1 rounded-full bg-brass" />
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {listing.sourceUrl && (
          <p className="mt-8 text-xs text-muted">
            Listing details sourced from the original listing on{" "}
            {listing.scrapeDate ?? "file"}. Verify all information
            independently.
          </p>
        )}
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-brass">
              What Would This Home Cost You?
            </p>
            <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
              Estimate Your Payment
            </h2>
          </Reveal>
          <div className="mt-10">
            <AffordabilityCalculator
              initialPrice={listing.price}
              listingSlug={listing.slug}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl text-paper sm:text-4xl">
            Interested in {listing.address}?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-paper/70">
            Reach out to {agent.name} directly to schedule a showing or ask a
            question about this home.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink
              href={`/contact?reason=listing&listing=${encodeURIComponent(listing.slug)}`}
              variant="filled"
            >
              Contact About This Home
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
