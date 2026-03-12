"""
Samsung Electronics (005930.KS) — Investment Thesis Charts
Clear Waters Capital — Ink & Water theme
Generated for: content/research/2026-03-samsung-electronics.mdx

Output → public/research/
    samsung-hbm-market-share.png
    samsung-ds-division-op.png
    samsung-dram-pricing.png
    samsung-peer-valuation.png
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.ticker as mticker
from matplotlib.lines import Line2D

# ---------------------------------------------------------------------------
# Clear Waters "Ink & Water" palette
# ---------------------------------------------------------------------------
IVORY        = "#f7f5f0"   # page background
INK          = "#1c1c1c"   # primary text
TEAL         = "#2d8b8b"   # accent / Samsung highlight
GOLD         = "#c8a96e"   # decorative / secondary accent
MUTED        = "#e0ddd8"   # borders / grid
SUBTLE       = "#999999"   # secondary text
RED_NEG      = "#b91c1c"   # loss bars
BLUE_PEER    = "#6b8cba"   # peer company bars
GREEN_MICRON = "#4a9e6b"   # Micron
BLUE_HYNIX   = "#5178a8"   # SK Hynix

FONT_FAMILY  = "DejaVu Sans"
DPI          = 150

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "research")
os.makedirs(OUTPUT_DIR, exist_ok=True)

plt.rcParams.update({
    "font.family":        FONT_FAMILY,
    "text.color":         INK,
    "axes.labelcolor":    INK,
    "xtick.color":        SUBTLE,
    "ytick.color":        SUBTLE,
    "axes.edgecolor":     MUTED,
    "axes.facecolor":     IVORY,
    "figure.facecolor":   IVORY,
    "grid.color":         MUTED,
    "grid.linewidth":     0.7,
    "grid.alpha":         1.0,
    "axes.grid":          True,
    "axes.grid.axis":     "y",
    "axes.spines.top":    False,
    "axes.spines.right":  False,
    "legend.facecolor":   IVORY,
    "legend.edgecolor":   MUTED,
    "legend.labelcolor":  INK,
    "axes.titlecolor":    INK,
    "figure.dpi":         DPI,
})


def save(fig, filename):
    path = os.path.join(OUTPUT_DIR, filename)
    fig.savefig(path, dpi=DPI, bbox_inches="tight", facecolor=fig.get_facecolor())
    print(f"  Saved → {path}")
    plt.close(fig)


def subtitle(fig, text):
    """Add a light subtitle line below suptitle."""
    fig.text(0.5, 0.92, text, ha="center", va="top", fontsize=9, color=SUBTLE,
             fontfamily=FONT_FAMILY)


# ===========================================================================
# CHART 1 — HBM Market Share by Vendor (Stacked Area, 2023–2026E)
# ===========================================================================
def chart_1_hbm_market_share():
    print("Generating Chart 1: HBM Market Share…")

    quarters = [
        "Q1'23", "Q2'23", "Q3'23", "Q4'23",
        "Q1'24", "Q2'24", "Q3'24", "Q4'24",
        "Q1'25", "Q2'25", "Q3'25", "Q4'25",
        "Q1'26E", "Q2'26E", "Q3'26E", "Q4'26E",
    ]
    hynix   = [50, 52, 53, 54, 55, 60, 60, 60, 62, 65, 63, 61, 60, 58, 56, 55]
    samsung = [38, 37, 35, 34, 34, 30, 28, 25, 22, 17, 20, 22, 25, 28, 30, 32]
    micron  = [12, 11, 12, 12, 11, 10, 12, 15, 16, 18, 17, 17, 15, 14, 14, 13]

    x = np.arange(len(quarters))
    n_hist = 12

    fig, ax = plt.subplots(figsize=(12, 6.5))

    ax.stackplot(
        x,
        np.array(hynix),
        np.array(samsung),
        np.array(micron),
        colors=[BLUE_HYNIX, TEAL, GREEN_MICRON],
        alpha=0.80,
        labels=["SK Hynix", "Samsung", "Micron"],
    )

    # Estimate region
    ax.axvspan(n_hist - 0.5, len(quarters) - 0.5,
               color=INK, alpha=0.03, zorder=0)
    ax.text(n_hist - 0.35, 96, "ESTIMATES →",
            color=SUBTLE, fontsize=8, style="italic", va="top")

    # Samsung nadir
    hynix_arr   = np.array(hynix)
    samsung_arr = np.array(samsung)
    nadir_y = hynix_arr[9] + samsung_arr[9] / 2
    ax.annotate(
        "Samsung nadir\n17%",
        xy=(9, nadir_y), xytext=(6.5, 38),
        color=TEAL, fontsize=8, fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=TEAL, lw=1.2),
        bbox=dict(boxstyle="round,pad=0.3", facecolor=IVORY, edgecolor=TEAL, alpha=0.95),
        zorder=7,
    )

    # HBM4 shipments begin
    ax.axvline(12, color=GOLD, linewidth=1.4, linestyle="--", alpha=0.9, zorder=5)
    ax.text(12.1, 60, "HBM4\nShipments\nBegin",
            color=GOLD, fontsize=7.5, va="center", zorder=6,
            bbox=dict(boxstyle="round,pad=0.25", facecolor=IVORY, edgecolor=GOLD, alpha=0.9))

    ax.set_xlim(-0.5, len(quarters) - 0.5)
    ax.set_ylim(0, 100)
    ax.set_xticks(x)
    ax.set_xticklabels(quarters, rotation=38, ha="right", fontsize=8.5)
    ax.set_yticklabels([f"{v}%" for v in ax.get_yticks().astype(int)], fontsize=9)
    ax.set_ylabel("Market Share (%)", fontsize=10, labelpad=8)
    ax.yaxis.grid(True)
    ax.xaxis.grid(False)

    ax.legend(
        handles=[
            mpatches.Patch(color=BLUE_HYNIX, label="SK Hynix", alpha=0.8),
            mpatches.Patch(color=TEAL,       label="Samsung",  alpha=0.8),
            mpatches.Patch(color=GREEN_MICRON,label="Micron",   alpha=0.8),
        ],
        loc="upper left", fontsize=9, framealpha=1.0,
    )

    fig.suptitle("HBM Market Share by Vendor (2023–2026E)",
                 fontsize=13, fontweight="bold", color=INK, y=0.98)
    fig.text(0.99, 0.01, "Source: TrendForce, Counterpoint Research, CWC estimates",
             ha="right", va="bottom", fontsize=7, color=SUBTLE, style="italic")

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    save(fig, "samsung-hbm-market-share.png")


# ===========================================================================
# CHART 2 — Samsung DS Division: Quarterly Operating Profit
# ===========================================================================
def chart_2_ds_division_op():
    print("Generating Chart 2: DS Division Operating Profit…")

    quarters = [
        "Q1'23", "Q2'23", "Q3'23", "Q4'23",
        "Q1'24", "Q2'24", "Q3'24", "Q4'24",
        "Q1'25", "Q2'25", "Q3'25", "Q4'25",
    ]
    op_trn = [-4.58, -4.36, -3.75, -2.18,
              -1.42,  6.45,  7.00,  2.90,
               1.10,  0.40,  7.00, 16.40]
    margin = [None, None, None, None,
              None, None, None, None,
              None,  1.0, 20.0, 37.3]

    x = np.arange(len(quarters))

    fig, ax1 = plt.subplots(figsize=(12, 6.5))

    bar_colors = []
    for i, v in enumerate(op_trn):
        if i == len(op_trn) - 1:
            bar_colors.append(GOLD)
        elif v < 0:
            bar_colors.append(RED_NEG)
        else:
            bar_colors.append(TEAL)

    bars = ax1.bar(x, op_trn, color=bar_colors, width=0.6, zorder=3,
                   edgecolor=IVORY, linewidth=0.8, alpha=0.88)
    ax1.axhline(0, color=INK, linewidth=0.9, alpha=0.4, zorder=4)

    ax2 = ax1.twinx()
    ax2.set_facecolor(IVORY)
    ax2.spines["top"].set_visible(False)

    margin_x = [i for i, m in enumerate(margin) if m is not None]
    margin_y = [m for m in margin if m is not None]
    if margin_x:
        ax2.plot(margin_x, margin_y,
                 color=GOLD, linewidth=2.2, marker="o",
                 markersize=6, markerfacecolor=GOLD,
                 markeredgecolor=IVORY, markeredgewidth=1.5,
                 zorder=5, label="OP Margin %")
        ax2.set_ylabel("Operating Margin (%)", color=GOLD, fontsize=10, labelpad=8)
        ax2.tick_params(axis="y", colors=GOLD)
        ax2.set_ylim(-20, 55)
        ax2.yaxis.grid(False)
        for xi, yi in zip(margin_x, margin_y):
            ax2.text(xi + 0.15, yi + 1.5, f"{yi:.1f}%",
                     color=GOLD, fontsize=8, fontweight="bold", va="bottom")

    for rect, val in zip(bars, op_trn):
        offset = 0.3 if val >= 0 else -0.45
        va = "bottom" if val >= 0 else "top"
        ax1.text(rect.get_x() + rect.get_width() / 2,
                 val + offset,
                 f"{val:+.1f}T",
                 ha="center", va=va, fontsize=7.5, color=INK, fontweight="bold")

    ax1.annotate("HBM3E nadir",
        xy=(9, 0.40), xytext=(7.0, 5.5),
        color=RED_NEG, fontsize=8, fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=RED_NEG, lw=1.2),
        bbox=dict(boxstyle="round,pad=0.3", facecolor=IVORY, edgecolor=RED_NEG, alpha=0.95),
        zorder=8)

    ax1.annotate("Record\n₩16.4T  ·  37.3% margin",
        xy=(11, 16.40), xytext=(8.8, 17.5),
        color=GOLD, fontsize=8.5, fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=GOLD, lw=1.4),
        bbox=dict(boxstyle="round,pad=0.35", facecolor=IVORY, edgecolor=GOLD, alpha=0.95),
        zorder=8)

    ax1.set_xlim(-0.5, len(quarters) - 0.5)
    ax1.set_ylim(-7.5, 22)
    ax1.set_xticks(x)
    ax1.set_xticklabels(quarters, rotation=38, ha="right", fontsize=8.5)
    ax1.set_ylabel("Operating Profit (KRW Trillion)", fontsize=10, labelpad=8)
    ax1.yaxis.grid(True)
    ax1.xaxis.grid(False)

    legend_handles = [
        mpatches.Patch(color=RED_NEG,  label="Loss quarter",        alpha=0.88),
        mpatches.Patch(color=TEAL,     label="Profit quarter",       alpha=0.88),
        mpatches.Patch(color=GOLD,     label="Record quarter (Q4'25)", alpha=0.88),
        Line2D([0], [0], color=GOLD, linewidth=2, marker="o", markersize=6, label="OP Margin %"),
    ]
    ax1.legend(handles=legend_handles, loc="upper left", fontsize=8.5, framealpha=1.0)

    fig.suptitle("Samsung DS Division — Quarterly Operating Profit",
                 fontsize=13, fontweight="bold", color=INK, y=0.98)
    fig.text(0.99, 0.01, "Source: Samsung Electronics Earnings Releases",
             ha="right", va="bottom", fontsize=7, color=SUBTLE, style="italic")

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    save(fig, "samsung-ds-division-op.png")


# ===========================================================================
# CHART 3 — Server DDR5 Contract Price Index
# ===========================================================================
def chart_3_dram_pricing():
    print("Generating Chart 3: DRAM Pricing…")

    quarters = [
        "Q1'23", "Q2'23", "Q3'23", "Q4'23",
        "Q1'24", "Q2'24", "Q3'24", "Q4'24",
        "Q1'25", "Q2'25", "Q3'25", "Q4'25",
        "Q1'26E", "Q2'26E", "Q3'26E",
    ]
    index  = [100, 88, 92, 105, 118, 135, 148, 160, 155, 162, 198, 272, 435, 470, 403]
    n_hist = 12

    x = np.arange(len(quarters))

    fig, ax = plt.subplots(figsize=(12, 6.5))

    ax.axvspan(n_hist - 0.5, len(quarters) - 0.5,
               color=INK, alpha=0.03, zorder=0)
    ax.text(n_hist - 0.35, max(index) * 0.97, "ESTIMATES →",
            color=SUBTLE, fontsize=8, style="italic", va="top")

    ax.fill_between(x[:n_hist], index[:n_hist], alpha=0.12, color=TEAL, zorder=1)
    ax.fill_between(x[n_hist - 1:], index[n_hist - 1:], alpha=0.07, color=TEAL, zorder=1)

    ax.plot(x[:n_hist], index[:n_hist],
            color=TEAL, linewidth=2.5, zorder=3,
            marker="o", markersize=5, markerfacecolor=TEAL,
            markeredgecolor=IVORY, markeredgewidth=1.5)
    ax.plot(x[n_hist - 1:], index[n_hist - 1:],
            color=TEAL, linewidth=2.5, zorder=3, linestyle="--",
            marker="o", markersize=5, markerfacecolor=TEAL,
            markeredgecolor=IVORY, markeredgewidth=1.5)

    # HBM diversion
    ax.axvline(9, color=GOLD, linewidth=1.4, linestyle=":", alpha=0.85, zorder=4)
    ax.text(9.1, 300, "HBM diversion\naccelerates",
            color=GOLD, fontsize=8, va="center",
            bbox=dict(boxstyle="round,pad=0.3", facecolor=IVORY, edgecolor=GOLD, alpha=0.9))

    ax.annotate("+45–50% QoQ",
        xy=(11, 272), xytext=(9.0, 360),
        color=TEAL, fontsize=8.5, fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=TEAL, lw=1.3),
        bbox=dict(boxstyle="round,pad=0.3", facecolor=IVORY, edgecolor=TEAL, alpha=0.9))

    ax.set_xlim(-0.5, len(quarters) - 0.5)
    ax.set_ylim(0, 540)
    ax.set_xticks(x)
    ax.set_xticklabels(quarters, rotation=38, ha="right", fontsize=8.5)
    ax.set_ylabel("Price Index (Q1 2023 = 100)", fontsize=10, labelpad=8)
    ax.yaxis.grid(True)
    ax.xaxis.grid(False)

    legend_handles = [
        Line2D([0], [0], color=TEAL, linewidth=2.5, marker="o", markersize=5, label="Historical"),
        Line2D([0], [0], color=TEAL, linewidth=2.5, linestyle="--", marker="o", markersize=5, label="Estimate"),
    ]
    ax.legend(handles=legend_handles, loc="upper left", fontsize=9, framealpha=1.0)

    fig.suptitle("Server DDR5 Contract Price Index (Q1 2023 = 100)",
                 fontsize=13, fontweight="bold", color=INK, y=0.98)
    fig.text(0.99, 0.01, "Source: TrendForce, Gartner, CWC estimates",
             ha="right", va="bottom", fontsize=7, color=SUBTLE, style="italic")

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    save(fig, "samsung-dram-pricing.png")


# ===========================================================================
# CHART 4 — Peer Valuation Comparison (Dual Panel)
# ===========================================================================
def chart_4_peer_valuation():
    print("Generating Chart 4: Peer Valuation…")

    companies = ["Samsung", "SK Hynix", "Micron", "TSMC", "NVIDIA"]
    pe_vals   = [7.4, 10.0, 20.9, 22.0, 28.0]
    ev_vals   = [11.0, 13.2, 20.9, 18.0, 45.0]

    bar_colors = [TEAL if c == "Samsung" else BLUE_PEER for c in companies]

    fig, (ax_pe, ax_ev) = plt.subplots(1, 2, figsize=(13, 5.5))

    for ax in (ax_pe, ax_ev):
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)

    y = np.arange(len(companies))

    # ---- Left: Forward P/E ----
    bars_pe = ax_pe.barh(y, pe_vals, color=bar_colors, height=0.52,
                         edgecolor=IVORY, linewidth=0.6, zorder=3, alpha=0.88)
    ax_pe.axvline(pe_vals[0], color=TEAL, linewidth=1.2,
                  linestyle="--", alpha=0.55, zorder=2)

    for i, (rect, val) in enumerate(zip(bars_pe, pe_vals)):
        ax_pe.text(val + 0.4, rect.get_y() + rect.get_height() / 2,
                   f"{val:.1f}x",
                   ha="left", va="center", fontsize=10,
                   fontweight="bold" if companies[i] == "Samsung" else "normal",
                   color=TEAL if companies[i] == "Samsung" else INK)

    ax_pe.set_yticks(y)
    ax_pe.set_yticklabels(companies, fontsize=11)
    ax_pe.set_xlabel("Forward P/E (x)", fontsize=10, labelpad=6)
    ax_pe.set_xlim(0, 36)
    ax_pe.xaxis.grid(True)
    ax_pe.yaxis.grid(False)
    ax_pe.set_title("Forward P/E Multiple", fontsize=11.5, fontweight="bold",
                    color=INK, pad=10)
    ax_pe.invert_yaxis()

    # ---- Right: EV/EBITDA ----
    bars_ev = ax_ev.barh(y, ev_vals, color=bar_colors, height=0.52,
                         edgecolor=IVORY, linewidth=0.6, zorder=3, alpha=0.88)
    ax_ev.axvline(ev_vals[0], color=TEAL, linewidth=1.2,
                  linestyle="--", alpha=0.55, zorder=2)

    for i, (rect, val) in enumerate(zip(bars_ev, ev_vals)):
        ax_ev.text(val + 0.8, rect.get_y() + rect.get_height() / 2,
                   f"{val:.1f}x",
                   ha="left", va="center", fontsize=10,
                   fontweight="bold" if companies[i] == "Samsung" else "normal",
                   color=TEAL if companies[i] == "Samsung" else INK)

    ax_ev.set_yticks(y)
    ax_ev.set_yticklabels(companies, fontsize=11)
    ax_ev.set_xlabel("EV/EBITDA (x)", fontsize=10, labelpad=6)
    ax_ev.set_xlim(0, 58)
    ax_ev.xaxis.grid(True)
    ax_ev.yaxis.grid(False)
    ax_ev.set_title("EV/EBITDA Multiple", fontsize=11.5, fontweight="bold",
                    color=INK, pad=10)
    ax_ev.invert_yaxis()

    fig.suptitle("Large-Cap Semiconductor Valuation Comparison — March 2026",
                 fontsize=13, fontweight="bold", color=INK, y=1.02)
    fig.text(0.5, -0.05,
             "Samsung at 7.4x forward P/E — lowest in peer group on ~150% consensus EPS growth",
             ha="center", fontsize=9, color=SUBTLE, style="italic")
    fig.text(0.99, -0.08, "Source: StockAnalysis, Bloomberg, CWC",
             ha="right", fontsize=7, color=SUBTLE, style="italic")

    plt.tight_layout(rect=[0, 0.0, 1, 1.0])
    save(fig, "samsung-peer-valuation.png")


# ===========================================================================
# CHART 5 — Financial Estimates (Revenue & Operating Profit, 2024A–2027E)
# ===========================================================================
def chart_5_estimates():
    print("Generating Chart 5: Financial Estimates…")

    years      = ["2024A", "2025A", "2026E", "2027E"]
    revenue    = [300.9, 333.6, 390.0, 445.0]   # midpoints of ranges
    group_op   = [32.7,  43.6,  100.0, 117.5]   # midpoints
    ds_op      = [6.5,   24.9,  60.0,  75.0]    # midpoints
    ds_margin  = [6.0,   19.0,  35.5,  37.5]    # midpoints

    x    = np.arange(len(years))
    w    = 0.28

    fig, ax1 = plt.subplots(figsize=(11, 6))

    # Revenue bars (left axis)
    bars_rev = ax1.bar(x - w/2, revenue, width=w, color=TEAL,
                       alpha=0.75, label="Group Revenue", zorder=3,
                       edgecolor=IVORY, linewidth=0.6)
    # Group OP bars
    bars_gop = ax1.bar(x + w/2, group_op, width=w, color=GOLD,
                       alpha=0.80, label="Group Operating Profit", zorder=3,
                       edgecolor=IVORY, linewidth=0.6)

    # Estimate shading
    ax1.axvspan(1.5, 3.5, color=INK, alpha=0.03, zorder=0)
    ax1.text(1.55, max(revenue) * 0.97, "ESTIMATES →",
             color=SUBTLE, fontsize=8, style="italic", va="top")

    # Bar labels
    for rect, val in zip(bars_rev, revenue):
        ax1.text(rect.get_x() + rect.get_width() / 2, val + 3,
                 f"₩{val:.0f}T", ha="center", va="bottom",
                 fontsize=8, color=TEAL, fontweight="600")
    for rect, val in zip(bars_gop, group_op):
        ax1.text(rect.get_x() + rect.get_width() / 2, val + 3,
                 f"₩{val:.0f}T", ha="center", va="bottom",
                 fontsize=8, color=GOLD, fontweight="600")

    ax1.set_ylim(0, max(revenue) * 1.18)
    ax1.set_ylabel("KRW Trillion", fontsize=10, labelpad=8)
    ax1.set_xticks(x)
    ax1.set_xticklabels(years, fontsize=10.5)
    ax1.yaxis.grid(True)
    ax1.xaxis.grid(False)

    # DS margin line (right axis)
    ax2 = ax1.twinx()
    ax2.spines["top"].set_visible(False)
    ax2.plot(x, ds_margin, color=RED_NEG, linewidth=2.2, marker="o",
             markersize=6, markerfacecolor=RED_NEG, markeredgecolor=IVORY,
             markeredgewidth=1.5, zorder=5, label="DS OP Margin")
    for xi, yi in zip(x, ds_margin):
        ax2.text(xi + 0.12, yi + 1.2, f"{yi:.1f}%",
                 color=RED_NEG, fontsize=8, fontweight="bold")
    ax2.set_ylabel("DS Division OP Margin (%)", color=RED_NEG, fontsize=10, labelpad=8)
    ax2.tick_params(axis="y", colors=RED_NEG)
    ax2.set_ylim(0, 60)
    ax2.yaxis.grid(False)

    # Legend
    legend_handles = [
        mpatches.Patch(color=TEAL,    alpha=0.75, label="Group Revenue"),
        mpatches.Patch(color=GOLD,    alpha=0.80, label="Group Operating Profit"),
        Line2D([0], [0], color=RED_NEG, linewidth=2, marker="o",
               markersize=6, label="DS Division OP Margin"),
    ]
    ax1.legend(handles=legend_handles, loc="upper left", fontsize=9, framealpha=1.0)

    fig.suptitle("Samsung Electronics — Financial Estimates (KRW Trillion)",
                 fontsize=13, fontweight="bold", color=INK, y=0.98)
    fig.text(0.99, 0.01,
             "Source: Samsung Electronics, sell-side consensus. 2026–2027E = range midpoints.",
             ha="right", va="bottom", fontsize=7, color=SUBTLE, style="italic")

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    save(fig, "samsung-estimates.png")


# ===========================================================================
# CHART 6 — Price Target Scenarios
# ===========================================================================
def chart_6_price_targets():
    print("Generating Chart 6: Price Target Scenarios…")

    current  = 173500
    scenarios = [
        ("Bear",  145000, RED_NEG,  "Yield failures limit volume;\nmemory cycle peaks early"),
        ("Base",  240000, TEAL,     "20% Rubin share achieved;\nyield improvements visible Q2"),
        ("Bull",  310000, GOLD,     "Yield resolved; HBM4 share\nexceeds 20%; cash deployment"),
    ]

    fig, ax = plt.subplots(figsize=(10, 4))

    y_positions = [0, 1, 2]
    bar_height  = 0.42

    for (label, target, color, rationale), ypos in zip(scenarios, y_positions):
        pct = (target - current) / current * 100
        pct_str = f"+{pct:.0f}%" if pct >= 0 else f"{pct:.0f}%"

        # Bar from current to target (or target to current for bear)
        left  = min(current, target)
        width = abs(target - current)
        ax.barh(ypos, width, left=left, height=bar_height,
                color=color, alpha=0.80, zorder=3, edgecolor=IVORY, linewidth=0.6)

        # Target price label (right of bar for bull/base, left for bear)
        if target >= current:
            ax.text(target + 3000, ypos, f"₩{target:,}  {pct_str}",
                    va="center", ha="left", fontsize=10.5, fontweight="bold", color=color)
        else:
            ax.text(target - 3000, ypos, f"{pct_str}  ₩{target:,}",
                    va="center", ha="right", fontsize=10.5, fontweight="bold", color=color)

        # Scenario label on y-axis
        ax.text(-8000, ypos, label, va="center", ha="right",
                fontsize=11, fontweight="700", color=color)

        # Rationale annotation inside or below bar
        ax.text(left + width / 2, ypos - 0.28, rationale,
                va="top", ha="center", fontsize=7.5, color=SUBTLE,
                style="italic", linespacing=1.4)

    # Current price line
    ax.axvline(current, color=INK, linewidth=1.8, linestyle="--", alpha=0.55, zorder=5)
    ax.text(current, 2.52, f"Current  ₩{current:,}",
            ha="center", va="bottom", fontsize=8.5, color=INK,
            fontweight="600",
            bbox=dict(boxstyle="round,pad=0.3", facecolor=IVORY, edgecolor=MUTED))

    ax.set_xlim(80000, 370000)
    ax.set_ylim(-0.6, 2.85)
    ax.set_yticks([])
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda v, _: f"₩{int(v):,}"))
    ax.tick_params(axis="x", labelsize=8.5, colors=SUBTLE)
    ax.yaxis.grid(False)
    ax.xaxis.grid(True)
    ax.spines["left"].set_visible(False)

    fig.suptitle("12-Month Price Target Scenarios",
                 fontsize=13, fontweight="bold", color=INK, y=0.98)
    fig.text(0.99, 0.01, "Source: Clear Waters Capital estimates",
             ha="right", va="bottom", fontsize=7, color=SUBTLE, style="italic")

    plt.tight_layout(rect=[0, 0.03, 1, 0.94])
    save(fig, "samsung-price-targets.png")


# ===========================================================================
if __name__ == "__main__":
    print(f"\nClear Waters Capital — Samsung Chart Generator")
    print(f"Output: {OUTPUT_DIR}\n")
    chart_1_hbm_market_share()
    chart_2_ds_division_op()
    chart_3_dram_pricing()
    chart_4_peer_valuation()
    chart_5_estimates()
    chart_6_price_targets()
    print("\nAll 6 charts generated.")
