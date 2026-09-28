// Styled static fallback for when WebGL is unavailable, still loading, or
// prefers-reduced-motion is set — never a blank hero.
export function StaticSkylineFallback() {
  const bars = [18, 34, 24, 46, 30, 58, 22, 40, 28, 50, 20, 36];

  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-end justify-center overflow-hidden opacity-70"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(198,161,91,0.10), transparent 60%)",
        }}
      />
      <div className="flex items-end gap-2 px-6 pb-0">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-6 border-t border-brass/40 sm:w-8"
            style={{
              height: `${h}vh`,
              background:
                "linear-gradient(to top, rgba(198,161,91,0.06), rgba(28,26,23,0.9))",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ground to-transparent" />
    </div>
  );
}
