# YouTube Digest & Deep Dive — Design Spec
**Date:** 2026-03-11
**Status:** Approved
**Target environment:** OpenClaw (Hostinger VPS, Docker container `openclaw-f4no-openclaw-1`)

---

## Overview

A two-part system that runs daily inside OpenClaw:

1. **Cron → `youtube-discovery` skill** — scrapes transcripts from a configured list of YouTube creators, OpenClaw analyzes them using knowledge of the user's investment focus, picks the 3 most relevant videos, and sends a digest to Telegram
2. **Telegram reply → `youtube-deepdive` skill** — user replies A/B/C, OpenClaw generates a research question from the chosen video's transcript, runs a NotebookLM audio deep dive, compresses it, and sends it back to Telegram

No YouTube API key required. No external services beyond what's already in OpenClaw.

---

## Architecture

```
creators.json
     │
     ▼
[Cron: daily 8am HKT]
     │
     ▼
youtube-discovery SKILL
     │  yt-dlp (channel scan, last 48h)
     │  youtube-transcript-api (fetch captions)
     │  OpenClaw analyzes transcripts
     │  Picks top 3 (China/HK equity lens)
     │
     ├──► state.json (saved)
     ├──► seen.json (updated)
     └──► Telegram ch.395: "A/B/C — reply to deep dive"
                │
          User replies "B"
                │
                ▼
     youtube-deepdive SKILL
          │  Reads state.json
          │  Generates research question
          │  NotebookLM workflow (nlm)
          │  ffmpeg compress
          └──► Telegram ch.395: audio file + note
```

---

## Data Layer

All files live at `/data/.openclaw/youtube-digest/` inside the container.

### `creators.json`
```json
{
  "channels": [
    "@BloombergTV",
    "@KylesBass",
    "@CNBCTelevision"
  ]
}
```
User edits this file to add/remove channels. No code changes needed.

### `state.json` (written by discovery, read by deepdive)
```json
{
  "date": "2026-03-11",
  "options": {
    "A": {
      "video_id": "abc123",
      "title": "Xi's Tech Crackdown Reversal",
      "channel": "@BloombergTV",
      "url": "https://youtube.com/watch?v=abc123",
      "summary": "Two-sentence summary of the video.",
      "why_relevant": "Why this matters for China/HK equity investing."
    },
    "B": { "...": "..." },
    "C": { "...": "..." }
  }
}
```

### `seen.json` (deduplication log)
```json
{
  "processed": [
    { "video_id": "abc123", "processed_at": "2026-03-11T08:00:00Z" }
  ]
}
```
Entries older than 72h are pruned on each run. Prevents re-processing the same video the next day.

### `cookies.txt`
Browser cookies exported to bypass YouTube's VPS IP blocks.
Path: `/data/.openclaw/youtube-digest/cookies.txt`
User exports this from their browser once; refreshed when blocks start occurring.

---

## Skill 1: `youtube-discovery`

**Location:** `/data/.openclaw/skills/youtube-discovery/SKILL.md`

**Invoked by:** Cron job (see Cron section below)

**Prerequisites (one-time install):**
- `pip install yt-dlp youtube-transcript-api` inside the container
- `cookies.txt` placed at the path above

**SKILL.md frontmatter:**
```yaml
---
name: youtube-discovery
description: Daily YouTube digest. Scrapes transcripts from configured channels, analyzes relevance for a China/HK equity investor, picks top 3, sends to Telegram.
metadata: {"openclaw": {"requires": {"bins": ["yt-dlp"]}, "version": "1.0.0"}}
---
```

**Workflow (instructions to OpenClaw):**

1. Read `creators.json` for channel list
2. Read `seen.json` (create empty if missing)
3. For each channel:
   ```bash
   yt-dlp --get-id --flat-playlist --dateafter now-2days \
     --cookies /data/.openclaw/youtube-digest/cookies.txt \
     --force-ipv4 \
     "https://youtube.com/@CHANNEL/videos"
   ```
4. Filter returned video IDs against `seen.json` — skip already-processed IDs
5. For each new video ID, fetch transcript:
   ```bash
   youtube-transcript-api VIDEO_ID --format text
   ```
   Sleep 15–30s (random) between requests to avoid rate limiting
6. If transcript fetch fails (IP block / no captions), fall back to:
   ```bash
   yt-dlp --write-auto-subs --skip-download --sub-format ttml \
     --cookies /data/.openclaw/youtube-digest/cookies.txt \
     "https://youtube.com/watch?v=VIDEO_ID"
   ```
7. **OpenClaw analyzes all transcripts** with the following context:
   - User runs Clear Waters Capital, a China/HK equity long-term fund
   - Focus areas: Chinese tech, HK property, macro policy, US-China trade, EM currencies
   - Prioritise: policy shifts, earnings surprises, valuation calls, macro catalysts
   - Deprioritise: general US equities, crypto, lifestyle content
8. Rank all videos by relevance. Pick top 3. For each, write:
   - `summary` — 2 sentences max, what was said
   - `why_relevant` — 1 sentence, why it matters to this investor
9. Save `state.json` with the 3 options
10. Update `seen.json` with all processed video IDs (even ones not selected). Prune entries > 72h old.
11. Send Telegram message to channel 395:

```
📺 YouTube Digest — March 11

A) @BloombergTV — Xi's Tech Crackdown Reversal
"Signals a potential policy reversal on platform regulation..."
→ Directly relevant to your Tencent/Alibaba thesis.

B) @KylesBass — HK Property Outlook
"Bass argues HK residential faces 18-month correction..."
→ Impacts your property exposure and HKD positioning.

C) @CNBC — Fed/China Trade
"US Treasury signals new tariff framework by Q2..."
→ Key catalyst watch for your macro overlay.

Reply A, B or C to go deeper.
```

**Error handling:**
- If 0 new videos found: send "No new videos today from your watchlist." to Telegram, exit cleanly
- If fewer than 3 videos found: send however many there are (A only, or A+B)
- If all transcript fetches fail: send "Could not fetch transcripts today (IP block). Try refreshing cookies.txt." to Telegram

---

## Skill 2: `youtube-deepdive`

**Location:** `/data/.openclaw/skills/youtube-deepdive/SKILL.md`

**Invoked by:** User replying "A", "B", or "C" in Telegram → OpenClaw receives the message and invokes this skill

**SKILL.md frontmatter:**
```yaml
---
name: youtube-deepdive
description: NotebookLM audio deep dive on a chosen YouTube video. Triggers when user replies A, B, or C after a YouTube digest message.
metadata: {"openclaw": {"requires": {"bins": ["nlm", "ffmpeg"]}, "version": "1.0.0"}}
---
```

**Workflow (instructions to OpenClaw):**

1. Parse the user's reply — extract A, B, or C (case-insensitive, trim whitespace)
2. Read `state.json`. Validate:
   - File exists and `date` matches today
   - Chosen option key (A/B/C) exists in `options`
   - If invalid: reply "No digest found for today. Run the discovery job first."
3. Extract from state: `title`, `channel`, `url`, full transcript text
4. **Generate research question**: OpenClaw reads the transcript and produces one sharp, investor-focused question. Examples:
   - "What are the key 2026 regulatory catalysts for Chinese internet platforms and how do they affect Tencent's monetisation outlook?"
   - "What is Kyle Bass's current thesis on HKD de-pegging and what would invalidate it?"
5. Send to Telegram: "🔍 Deep diving into: *[TITLE]* — generating your NotebookLM audio..."
6. Run NotebookLM workflow (follow `notebooklm-research-automation` skill rules):
   ```bash
   # 1. Authenticate
   nlm login --check

   # 2. Create notebook
   nlm notebook create "[TITLE] - Investor Deep Dive"
   # Save notebook ID

   # 3. Start research (deep mode)
   nlm research start "[GENERATED QUESTION]" --notebook-id <id> --mode deep
   # Poll every 120s, max 10 attempts

   # 4. Import sources
   nlm research import <notebook-id> <task-id>
   # Poll every 120s, max 5 attempts

   # 5. Generate audio
   nlm audio create <id> \
     --format deep_dive \
     --length long \
     --focus "[TITLE] - investor implications, risks, 2026 outlook" \
     --confirm

   # 6. Download
   nlm download audio <id> \
     --output "/data/.openclaw/youtube-digest/audio/[slug]-deep-dive.mp3"
   ```
7. Compress with ffmpeg (target ≤ 30MB for Telegram):
   ```bash
   ffmpeg -i input.mp3 -b:a 64k -ac 1 output-compressed.mp3
   ```
8. Send compressed `.mp3` to Telegram channel 395:
   > "🎧 Your deep dive is ready: *[TITLE]* — [N] min"
9. Clean up: delete uncompressed original

**Error handling (from notebooklm-research-automation rules):**
- Auth expired → "nlm auth expired. Please re-authenticate." Stop.
- Rate limit ("no confirmation from API") → "NotebookLM rate limit hit. Try again in 30 min." Stop.
- Research > 20 min → Cancel, alert user
- Audio > 10 min → Cancel, alert user

---

## Cron Job

**Name:** `youtube-discovery`
**Schedule:** `0 0 * * *` (UTC) = 8am HKT
**wakeMode:** `"skip"` (required — never `"now"`)
**Prompt:** `"Run the youtube-discovery skill"`

Added to `jobs.json` following the standard OpenClaw cron workflow:
1. `pm2 stop mission-control-acd`
2. Add entry to `jobs.json`
3. `pm2 restart mission-control-acd`

---

## One-Time Setup Steps

1. Install Python dependencies inside container:
   ```bash
   docker exec openclaw-f4no-openclaw-1 pip install yt-dlp youtube-transcript-api
   ```
2. Verify ffmpeg is available:
   ```bash
   docker exec openclaw-f4no-openclaw-1 which ffmpeg
   ```
   Install if missing: `apt-get install -y ffmpeg`
3. Update nlm to v0.4.5:
   ```bash
   docker exec openclaw-f4no-openclaw-1 uv tool upgrade notebooklm-mcp-cli
   ```
4. Create data directory:
   ```bash
   docker exec openclaw-f4no-openclaw-1 mkdir -p /data/.openclaw/youtube-digest/audio
   ```
5. Create `creators.json` with initial channel list
6. Export `cookies.txt` from browser and upload to `/data/.openclaw/youtube-digest/cookies.txt`
7. Write `youtube-discovery/SKILL.md`
8. Write `youtube-deepdive/SKILL.md`
9. Add cron job to `jobs.json`
10. Test: manually trigger `youtube-discovery`, verify Telegram message, reply "A", verify deep dive runs

---

## Out of Scope (Future)

- Automatic `cookies.txt` refresh
- Multiple deep dives per day
- Filtering by keyword/topic at runtime
- Video download (audio/video files, not just transcripts)
