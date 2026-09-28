import Link from "next/link";
import { agent } from "@/content/agent";

export function Footer() {
  const year = new Date().getFullYear();
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(agent.officeAddress)}`;

  return (
    <footer className="border-t border-line bg-ground-deep">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="font-display text-xl text-paper">{agent.name}</p>
          <p className="mt-1 text-sm text-muted">{agent.brokerage}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-brass">
            {agent.license}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Office</p>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block max-w-[22ch] text-sm leading-relaxed text-paper/85 transition-colors hover:text-brass"
          >
            {agent.officeAddress}
          </a>
          {agent.phone && (
            <a
              href={`tel:${agent.phone}`}
              className="mt-3 block text-sm text-paper/85 transition-colors hover:text-brass"
            >
              {agent.phone}
            </a>
          )}
          {agent.email && (
            <a
              href={`mailto:${agent.email}`}
              className="mt-1 block text-sm text-paper/85 transition-colors hover:text-brass"
            >
              {agent.email}
            </a>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Service Areas</p>
          <ul className="mt-3 space-y-1 text-sm text-paper/85">
            {agent.serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Quick Links</p>
          <ul className="mt-3 space-y-1 text-sm text-paper/85">
            <li>
              <Link href="/listings" className="transition-colors hover:text-brass">
                Listings
              </Link>
            </li>
            <li>
              <Link href="/calculator" className="transition-colors hover:text-brass">
                Affordability Calculator
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-brass">
                Contact
              </Link>
            </li>
          </ul>

          {agent.socialLinks.length > 0 && (
            <div className="mt-6 flex gap-4">
              {agent.socialLinks.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.15em] text-paper/70 transition-colors hover:text-brass"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line px-6 py-6 text-center text-xs text-muted lg:px-10">
        © {year} {agent.name} · {agent.brokerage} · {agent.license}. Listing
        photos and details are believed accurate but not guaranteed; verify all
        information independently.
      </div>
    </footer>
  );
}
