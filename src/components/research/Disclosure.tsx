export function Disclosure() {
  return (
    <section
      className="mt-16 pt-8 text-xs leading-relaxed"
      style={{
        borderTop: "1px solid var(--muted)",
        color: "var(--subtle)",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      <p className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
        Disclosure
      </p>
      <p>
        Clear Waters Capital LP may hold positions in securities mentioned in this memo.
        This document is for informational purposes only and does not constitute
        investment advice, a solicitation, or an offer to buy or sell any security.
        All opinions are those of Clear Waters Capital LP and are subject to change
        without notice. Past performance is not indicative of future results.
        Investing involves risk, including the possible loss of principal.
        This memo is intended solely for the person to whom it has been delivered
        and may not be reproduced or redistributed without written consent.
      </p>
    </section>
  );
}
