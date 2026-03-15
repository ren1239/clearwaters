"""
Hesai Group (HKEX: 2525) — Investment Thesis Charts
Clear Waters Capital — Ink & Water theme
Generated for: content/research/2026-03-hesai.mdx

Regenerates:
    public/research/hesai/2026-03/chart_33_price_target_scenarios.png
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# ---------------------------------------------------------------------------
# Clear Waters "Ink & Water" palette
# ---------------------------------------------------------------------------
IVORY   = "#f7f5f0"
INK     = "#1c1c1c"
TEAL    = "#2d8b8b"
GOLD    = "#c8a96e"
MUTED   = "#e0ddd8"
SUBTLE  = "#999999"
RED     = "#c0392b"
GREEN   = "#27ae60"
DKGREEN = "#1e8449"

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "research", "hesai", "2026-03")
os.makedirs(OUT_DIR, exist_ok=True)


def save(fig, name):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=IVORY)
    print(f"  Saved: {path}")
    plt.close(fig)


# ---------------------------------------------------------------------------
# chart_33 — Price Target Scenarios (HKD)
# ---------------------------------------------------------------------------
labels    = ["Bear Case\n(P=20%)", "Base Case\n(P=60%)", "Bull Case\n(P=20%)", "Wtd. Avg.\nPT"]
values    = [157.2, 231.1, 295.8, 229.3]
colors    = [RED, TEAL, GREEN, DKGREEN]
pct_chg   = [-15, +25, +60, None]
current   = 184.9

fig, ax = plt.subplots(figsize=(8, 5.5), facecolor=IVORY)
ax.set_facecolor(IVORY)

bars = ax.bar(labels, values, color=colors, width=0.55, zorder=3)

# annotate bars
for bar, val, pct in zip(bars, values, pct_chg):
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        val + 3,
        f"HK${val:.1f}",
        ha="center", va="bottom",
        fontsize=10, fontweight="bold", color=INK,
    )
    if pct is not None:
        sign = "+" if pct > 0 else ""
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            val / 2,
            f"{sign}{pct}%",
            ha="center", va="center",
            fontsize=9, color="white", fontweight="bold",
        )

# current price line
ax.axhline(current, color=GOLD, linewidth=1.6, linestyle="--", zorder=4, label=f"Current HK${current:.1f}")

# PT reference line
ax.axhline(231.1, color=TEAL, linewidth=1.2, linestyle=":", zorder=4, alpha=0.6, label="PT HK$231")

ax.set_ylim(0, 350)
ax.set_ylabel("Price per Share (HK$)", color=INK, fontsize=10)
ax.tick_params(colors=INK, labelsize=9)
for spine in ax.spines.values():
    spine.set_edgecolor(MUTED)
ax.yaxis.grid(True, color=MUTED, linewidth=0.6, zorder=0)
ax.set_axisbelow(True)

ax.set_title(
    "Price Target Scenarios: Bear / Base / Bull\nBUY Rating | HK$231 PT (5.5x EV/2026E NTM Revenue)",
    color=INK, fontsize=11, fontweight="bold", pad=12,
)

legend = ax.legend(fontsize=8, frameon=True, facecolor=IVORY, edgecolor=MUTED, loc="upper left")
for text in legend.get_texts():
    text.set_color(INK)

ax.text(
    0.99, 0.02,
    "Source: Hesai Group filings, Clear Waters Capital estimates, March 2026",
    transform=ax.transAxes, ha="right", va="bottom",
    fontsize=7, color=SUBTLE,
)

save(fig, "chart_33_price_target_scenarios.png")

print("Done.")
