"""
Tongfu Microelectronics (SZSE: 002156) — Investment Thesis Charts
Clear Waters Capital — Ink & Water theme
Generated for: content/research/2026-03-tfme.mdx

Output → public/research/tfme/2026-03/
    2026-03-revenue-composition.png
    2026-03-peer-multiples.png
    2026-03-price-targets.png
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker

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
TEAL2   = "#1a6b6b"   # darker teal for second segment
WARM    = "#8b5a2b"   # warm brown for third segment

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "research", "tfme", "2026-03")
os.makedirs(OUT_DIR, exist_ok=True)


def save(fig, name):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=IVORY)
    print(f"  Saved: {path}")
    plt.close(fig)


def source_note(ax, text):
    ax.text(0.01, -0.08, text, transform=ax.transAxes,
            ha="left", va="top", fontsize=7, color=SUBTLE)


# ---------------------------------------------------------------------------
# Chart 1 — Revenue Composition: AMD JV vs Non-AMD (2022–2026E)
# ---------------------------------------------------------------------------
years     = ["2022A", "2023A", "2024A", "2025E", "2026E"]
amd_rev   = [13.0,    14.0,    15.3,    18.0,    21.0]
nonamd    = [7.0,     8.0,     8.6,     10.2,    12.0]

fig, ax = plt.subplots(figsize=(8, 5), facecolor=IVORY)
ax.set_facecolor(IVORY)

x = np.arange(len(years))
w = 0.55
b1 = ax.bar(x, amd_rev, w, label="AMD JV Revenue (Suzhou + Penang)", color=TEAL, zorder=3)
b2 = ax.bar(x, nonamd,  w, bottom=amd_rev, label="Non-AMD Revenue", color=GOLD, zorder=3)

# value labels
for i, (a, n) in enumerate(zip(amd_rev, nonamd)):
    total = a + n
    ax.text(i, total + 0.3, f"¥{total:.1f}B", ha="center", va="bottom",
            fontsize=8.5, fontweight="bold", color=INK)

# separator line at 2024/2025 boundary
ax.axvline(x=2.5, color=MUTED, linewidth=1.2, linestyle="--", zorder=2)
ax.text(2.55, 27, "Estimated →", fontsize=7.5, color=SUBTLE, va="top")

ax.set_xticks(x)
ax.set_xticklabels(years, fontsize=9, color=INK)
ax.set_ylabel("Revenue (RMB Billion)", fontsize=10, color=INK)
ax.tick_params(colors=INK, labelsize=9)
ax.set_ylim(0, 32)
ax.yaxis.grid(True, color=MUTED, linewidth=0.6, zorder=0)
ax.set_axisbelow(True)
for spine in ax.spines.values():
    spine.set_edgecolor(MUTED)

ax.set_title("Revenue Composition: AMD JV vs Non-AMD (2022A–2026E)",
             color=INK, fontsize=11, fontweight="bold", pad=12)

leg = ax.legend(fontsize=8.5, frameon=True, facecolor=IVORY, edgecolor=MUTED, loc="upper left")
for t in leg.get_texts():
    t.set_color(INK)

source_note(ax, "Source: Tongfu Microelectronics filings, Clear Waters Capital estimates, March 2026")
save(fig, "2026-03-revenue-composition.png")


# ---------------------------------------------------------------------------
# Chart 2 — Peer EV/EBITDA Multiples
# ---------------------------------------------------------------------------
peers   = ["Amkor\n(AMKR)", "ASE\n(3711.TW)", "JCET\n(600584.SS)", "Applied\nMultiple", "TFME\n(002156.SZ)"]
eveb    = [12.6, 14.3, 16.7, 17.5, 19.2]
colors  = [SUBTLE, SUBTLE, SUBTLE, GOLD, RED]

fig, ax = plt.subplots(figsize=(8, 5), facecolor=IVORY)
ax.set_facecolor(IVORY)

bars = ax.bar(peers, eveb, color=colors, width=0.55, zorder=3)

for bar, val in zip(bars, eveb):
    ax.text(bar.get_x() + bar.get_width() / 2, val + 0.2,
            f"{val:.1f}x", ha="center", va="bottom",
            fontsize=10, fontweight="bold", color=INK)

# peer median line
median = 14.0
ax.axhline(median, color=TEAL, linewidth=1.5, linestyle="--", zorder=4,
           label=f"Bear case multiple (14.0x peer median)")

ax.set_ylim(0, 24)
ax.set_ylabel("EV/EBITDA (NTM)", fontsize=10, color=INK)
ax.tick_params(colors=INK, labelsize=9)
ax.yaxis.grid(True, color=MUTED, linewidth=0.6, zorder=0)
ax.set_axisbelow(True)
for spine in ax.spines.values():
    spine.set_edgecolor(MUTED)

ax.set_title("EV/EBITDA Peer Comparison — TFME Trades at Premium to Group",
             color=INK, fontsize=11, fontweight="bold", pad=12)

leg = ax.legend(fontsize=8.5, frameon=True, facecolor=IVORY, edgecolor=MUTED)
for t in leg.get_texts():
    t.set_color(INK)

source_note(ax, "Source: MarketScreener, Clear Waters Capital, March 2026. Applied multiple = 17.5x (AMD premium to JCET).")
save(fig, "2026-03-peer-multiples.png")


# ---------------------------------------------------------------------------
# Chart 3 — Price Target Scenarios
# ---------------------------------------------------------------------------
labels  = ["Bear\n(P=20%)", "Neutral PT\n(P=60%)", "Bull\n(P=20%)", "Consensus\nAvg."]
values  = [34.5, 47.0, 71.0, 38.67]
colors  = [RED, TEAL, "#27ae60", SUBTLE]
pcts    = [-30, -4, +45, None]
current = 49.08

fig, ax = plt.subplots(figsize=(8, 5.5), facecolor=IVORY)
ax.set_facecolor(IVORY)

bars = ax.bar(labels, values, color=colors, width=0.55, zorder=3)

for bar, val, pct in zip(bars, values, pcts):
    ax.text(bar.get_x() + bar.get_width() / 2, val + 0.8,
            f"¥{val:.2f}", ha="center", va="bottom",
            fontsize=10, fontweight="bold", color=INK)
    if pct is not None:
        sign = "+" if pct > 0 else ""
        ax.text(bar.get_x() + bar.get_width() / 2, val / 2,
                f"{sign}{pct}%", ha="center", va="center",
                fontsize=9, color="white", fontweight="bold")

# current price
ax.axhline(current, color=GOLD, linewidth=1.8, linestyle="--", zorder=4,
           label=f"Current ¥{current:.2f}")
# PT line
ax.axhline(47.0, color=TEAL, linewidth=1.2, linestyle=":", zorder=4, alpha=0.6,
           label="Neutral PT ¥47.00")

ax.set_ylim(0, 90)
ax.set_ylabel("Price per Share (CNY)", fontsize=10, color=INK)
ax.tick_params(colors=INK, labelsize=9)
ax.yaxis.grid(True, color=MUTED, linewidth=0.6, zorder=0)
ax.set_axisbelow(True)
for spine in ax.spines.values():
    spine.set_edgecolor(MUTED)

ax.set_title("Price Target Scenarios: Bear / Neutral / Bull\nNEUTRAL Rating | ¥47.00 PT (55% DCF / 45% EV/EBITDA Comps)",
             color=INK, fontsize=11, fontweight="bold", pad=12)

leg = ax.legend(fontsize=8.5, frameon=True, facecolor=IVORY, edgecolor=MUTED, loc="upper left")
for t in leg.get_texts():
    t.set_color(INK)

source_note(ax, "Source: Tongfu Microelectronics filings, Clear Waters Capital estimates, March 2026. Bear = ¥33–36 midpoint. Bull = ¥67–75 midpoint.")
save(fig, "2026-03-price-targets.png")

print("Done.")
