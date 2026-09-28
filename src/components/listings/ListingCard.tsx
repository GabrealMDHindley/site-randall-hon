import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Ruler } from "lucide-react";
import type { Listing } from "@/content/listings";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.photos[0];

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block overflow-hidden border border-line bg-surface transition-colors hover:border-brass/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ground-deep">
        {cover ? (
          <Image
            src={`/listings/${listing.slug}/${cover}`}
            alt={`${listing.address} — ${listing.city}, ${listing.state}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted">
            Photo Coming Soon
          </div>
        )}
        <span className="absolute left-4 top-4 border border-brass/50 bg-ground/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-brass">
          {listing.status}
        </span>
      </div>

      <div className="p-6">
        <p className="font-tabular font-display text-2xl text-brass">
          {formatCurrency(listing.price)}
        </p>
        <p className="mt-2 text-sm text-paper/90">{listing.address}</p>
        <p className="text-xs text-muted">
          {listing.city}, {listing.state} {listing.zip}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-paper/70">
          <span className="flex items-center gap-1.5">
            <Bed size={14} /> {listing.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={14} /> {listing.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler size={14} /> {formatNumber(listing.sqft)} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
