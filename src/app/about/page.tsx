"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div
      className="font-sans min-h-screen relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/your-background.jpg")' }}
    >
      <header className="container relative z-10">
        <Nav />
      </header>

      <main className="container relative z-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/20 backdrop-blur-sm my-8 text-neutral-800 border-0 shadow-2xl">
            <CardContent className="prose prose-lg dark:prose-invert max-w-4xl mx-auto p-8 space-y-8">
              <motion.h1
                className="text-4xl font-bold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                About Clear Waters Capital
              </motion.h1>

              <p className="text-base">
                ClearWaters Capital is a quiet investment partnership guided by
                clarity, self-discipline, and simple ideas.
              </p>
              <p className="text-base">
                We implement fundamental investment principles, leveraged by
                in-house developed analysis tools. Our approach is patient,
                concentrated capital — like water.
              </p>

              <hr />

              <h2 className="text-2xl font-semibold">
                Investment Policy Statement (IPS)
              </h2>

              <h3 className="text-3xl font-bold mt-8">1. Executive Summary</h3>
              <p className="text-base">
                Clear Waters Capital is a long-term, value-driven limited
                partnership (LP) fund with $10 million in committed capital. The
                fund targets superior risk-adjusted returns through a
                concentrated portfolio of public equities, following the
                philosophies of Charlie Munger and Warren Buffett.
              </p>

              <h3 className="text-3xl font-bold mt-8">
                2. Investment Objectives and Philosophy
              </h3>
              <ul className="text-base space-y-1">
                <li>
                  <strong>Primary Objective:</strong> Long-term capital
                  appreciation
                </li>
                <li>
                  <strong>Target Return:</strong> 15% annualized
                </li>
                <li>
                  <strong>Benchmark:</strong> Compare with both S&P 500 and MSCI
                  Global Index
                </li>
                <li>
                  <strong>Time Horizon:</strong> 10+ years
                </li>
                <li>
                  <strong>Volatility Tolerance:</strong> High
                </li>
                <li>
                  <strong>Moral Mandate:</strong> Invest in companies aligned
                  with long-term customer/investor value (Tech, EV, Consumer,
                  Telecom)
                </li>
              </ul>

              <h3 className="text-3xl font-bold mt-8">
                3. Investment Constraints
              </h3>
              <ul className="text-base space-y-1">
                <li>No liquidity needs for the first 10 years</li>
                <li>Tax-agnostic</li>
                <li>No regulatory constraints beyond LP structure</li>
                <li>Public equities only, no leverage</li>
                <li>No FX hedging — assumes long-term USD/CNY/HKD stability</li>
              </ul>

              <h3 className="text-3xl font-bold mt-8">
                4. Strategic Asset Allocation
              </h3>
              <p className="text-base">
                100% public equities. Portfolio of 8–10 positions, initially
                equal-weighted. No cap on position size; winners are allowed to
                grow.
              </p>

              <h3 className="text-3xl font-bold mt-8">
                5. Security Selection Criteria
              </h3>
              <ul className="text-base space-y-1">
                <li>Bottom-up, fundamental value analysis</li>
                <li>Valuation via DCF, SOTP, or manager discretion</li>
                <li>Focus on U.S., China, and Hong Kong equities</li>
                <li>Manager shares intrinsic vs. market value with LPs</li>
              </ul>

              <h3 className="text-3xl font-bold mt-8">
                6. Rebalancing and Monitoring
              </h3>
              <ul className="text-base space-y-1">
                <li>Review semiannually</li>
                <li>
                  Cyclical rebalancing based on valuation/geopolitical shifts
                </li>
                <li>Dynamic U.S./China weighting</li>
              </ul>

              <h3 className="text-3xl font-bold mt-8">7. Risk Management</h3>
              <ul className="text-base space-y-1">
                <li>Margin of safety focus</li>
                <li>No leverage or derivatives</li>
                <li>No defined drawdown constraints</li>
              </ul>

              <h3 className="text-3xl font-bold mt-8">
                8. Performance & Compensation
              </h3>
              <ul className="text-base space-y-1">
                <li>Benchmarked against S&P and MSCI Global</li>
                <li>Quarterly reporting includes intrinsic value updates</li>
                <li>Fee: 4% hurdle + 25% performance fee on excess</li>
              </ul>

              <h3 className="text-3xl font-bold mt-8">9. Governance</h3>
              <ul className="text-base space-y-1">
                <li>Fiduciary duty to LPs</li>
                <li>Semiannual disclosure of positions and rationale</li>
              </ul>

              <p className="text-base">
                <strong>Prepared for:</strong> Clear Waters Capital LP
                <br />
                <strong>Prepared by:</strong> Portfolio Management Team
                <br />
                <strong>Effective Date:</strong> 2025-07-31
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
