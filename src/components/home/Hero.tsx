"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { agent } from "@/content/agent";
import { ButtonLink } from "@/components/ui/Button";
import { StaticSkylineFallback } from "@/components/three/StaticSkylineFallback";
import {
  usePrefersReducedMotion,
  useWebGLAvailable,
} from "@/components/three/useWebGLAvailable";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => <StaticSkylineFallback />,
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const reduced = usePrefersReducedMotion();
  const webglAvailable = useWebGLAvailable();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=125%",
          scrub: 0.6,
          pin: true,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        },
      });

      tl.to(cueRef.current, { opacity: 0, duration: 0.4 }, 0)
        .to(beat1Ref.current, { opacity: 0, y: -50, duration: 1 }, 0.35)
        .fromTo(
          beat2Ref.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1 },
          0.55,
        )
        .to(beat2Ref.current, { opacity: 1, duration: 0.6 }, 1.3);
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ground"
    >
      <div className="absolute inset-0">
        {webglAvailable === false ? (
          <StaticSkylineFallback />
        ) : (
          <HeroCanvas scrollProgress={scrollProgress} />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ground/10 via-ground/30 to-ground" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ground/70 via-transparent to-ground/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10">
        <div ref={beat1Ref}>
          <p className="text-xs uppercase tracking-[0.3em] text-brass">
            Houston, Texas &middot; Since {agent.practiceSince}
          </p>
          <h1 className="mt-6 max-w-3xl text-balance font-display text-5xl leading-[1.05] text-paper sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            Four Decades of Trust in Houston Real Estate.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-paper/75 sm:text-lg">
            {agent.name} has represented buyers, sellers, landlords, and
            tenants across Houston since {agent.practiceSince} —{" "}
            {agent.closedTransactions} closed transactions and counting.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/listings" variant="filled">
              View Listings
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact Randall
            </ButtonLink>
          </div>
        </div>

        <div
          ref={beat2Ref}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 mx-auto max-w-4xl -translate-y-1/2 px-6 text-center opacity-0 lg:px-10"
        >
          <p className="font-display text-4xl leading-tight text-brass sm:text-5xl lg:text-6xl">
            Buyers. Sellers. Landlords. Tenants.
          </p>
          <p className="mt-3 font-display text-2xl text-paper/90 sm:text-3xl">
            One Trusted Name in Houston.
          </p>
        </div>
      </div>

      <div
        ref={cueRef}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}
