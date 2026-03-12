# YouTube Digest & Deep Dive — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a daily YouTube digest cron + on-demand NotebookLM audio deep dive, all running inside OpenClaw on the Hostinger VPS.

**Architecture:** A `youtube-discovery` skill (called by daily cron) scrapes transcripts from a config-driven creator list, has OpenClaw pick the top 3 relevant videos, and sends a Telegram digest. When the user replies A/B/C, OpenClaw invokes the `youtube-deepdive` skill, which generates a research question and runs the full NotebookLM audio workflow.

**Tech Stack:** `yt-dlp`, `youtube-transcript-api`, `ffmpeg` (already installed), `nlm` v0.4.5, OpenClaw skills, Telegram delivery, JSON state files on Docker volume.

**SSH pattern:** All commands run as:
```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 "docker exec openclaw-f4no-openclaw-1 <command>"
```

**Telegram destination:** `telegram:-1003775453374:topic:395`

---

## Chunk 1: Environment Setup

### Task 1: Install Python dependencies

**Files:**
- No files created — verifying/installing packages in container

- [ ] **Step 1: Check what's already installed**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 pip show yt-dlp youtube-transcript-api 2>&1"
```
Expected: either version info or "not found" for each package.

- [ ] **Step 2: Install missing packages**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 pip install yt-dlp youtube-transcript-api --quiet"
```
Expected: `Successfully installed ...` or `Requirement already satisfied`.

- [ ] **Step 3: Verify both are importable**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 python3 -c \
  'import yt_dlp; import youtube_transcript_api; print(\"OK\")'"
```
Expected: `OK`

- [ ] **Step 4: Verify ffmpeg path**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 /data/linuxbrew/.linuxbrew/bin/ffmpeg -version 2>&1 | head -1"
```
Expected: `ffmpeg version ...`

Note the full path: `/data/linuxbrew/.linuxbrew/bin/ffmpeg` (not in default PATH — use full path in all ffmpeg commands).

- [ ] **Step 5: Upgrade nlm to v0.4.5**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 uv tool upgrade notebooklm-mcp-cli"
```
Expected: `Updated notebooklm-mcp-cli ...` or already up to date.

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 nlm --version"
```
Expected: `nlm version 0.4.5`

---

### Task 2: Create directory structure and config files

**Files (on container):**
- Create: `/data/.openclaw/youtube-digest/` (directory)
- Create: `/data/.openclaw/youtube-digest/audio/` (directory)
- Create: `/data/.openclaw/youtube-digest/creators.json`
- Create: `/data/.openclaw/youtube-digest/seen.json` (empty seed)

- [ ] **Step 1: Create directories**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 mkdir -p \
  /data/.openclaw/youtube-digest/audio"
```
Expected: no output (success).

- [ ] **Step 2: Verify directories exist**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 ls /data/.openclaw/youtube-digest/"
```
Expected: `audio` listed.

- [ ] **Step 3: Write creators.json**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 "docker exec -i openclaw-f4no-openclaw-1 \
  tee /data/.openclaw/youtube-digest/creators.json" << 'EOF'
{
  "channels": [
    "@BloombergTV",
    "@KylesBass",
    "@CNBCTelevision"
  ]
}
EOF
```
Expected: file contents echoed back.

- [ ] **Step 4: Write empty seen.json**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 "docker exec -i openclaw-f4no-openclaw-1 \
  tee /data/.openclaw/youtube-digest/seen.json" << 'EOF'
{
  "processed": []
}
EOF
```
Expected: file contents echoed back.

- [ ] **Step 5: Verify files are valid JSON**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 python3 -c \
  'import json; json.load(open(\"/data/.openclaw/youtube-digest/creators.json\")); \
   json.load(open(\"/data/.openclaw/youtube-digest/seen.json\")); print(\"JSON OK\")'"
```
Expected: `JSON OK`

---

### Task 3: Export and upload cookies.txt

**Files:**
- Create: `/data/.openclaw/youtube-digest/cookies.txt` (user-supplied)

- [ ] **Step 1: Export cookies from browser**

In Chrome/Firefox, install the "Get cookies.txt LOCALLY" extension.
Navigate to `https://www.youtube.com` while logged in.
Export cookies → save as `cookies.txt` locally.

- [ ] **Step 2: Upload to server**

```bash
scp -i ~/.ssh/id_hostinger cookies.txt \
  root@76.13.208.1:/tmp/yt-cookies.txt
```

- [ ] **Step 3: Copy into container**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker cp /tmp/yt-cookies.txt \
  openclaw-f4no-openclaw-1:/data/.openclaw/youtube-digest/cookies.txt"
```

- [ ] **Step 4: Test yt-dlp with cookies against a known channel**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 yt-dlp \
  --get-id --flat-playlist --dateafter now-2days --force-ipv4 \
  --cookies /data/.openclaw/youtube-digest/cookies.txt \
  --max-downloads 3 \
  'https://www.youtube.com/@BloombergTV/videos' 2>&1 | head -20"
```
Expected: One or more YouTube video IDs printed (11-char strings like `dQw4w9WgXcQ`), or "0 items" if no videos in last 48h.
If you see `403 Forbidden` or bot-check error — cookies.txt needs to be refreshed.

---

## Chunk 2: youtube-discovery Skill

### Task 4: Write the youtube-discovery SKILL.md

**Files:**
- Create: `/data/.openclaw/skills/youtube-discovery/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 mkdir -p \
  /data/.openclaw/skills/youtube-discovery"
```

- [ ] **Step 2: Write SKILL.md**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 "docker exec -i openclaw-f4no-openclaw-1 \
  tee /data/.openclaw/skills/youtube-discovery/SKILL.md" << 'SKILLEOF'
---
name: youtube-discovery
description: Daily YouTube digest. Scrapes transcripts from configured creator channels, analyzes relevance for a China/HK equity investor, picks top 3 most relevant videos, sends digest to Telegram with A/B/C options.
metadata: {"openclaw": {"requires": {"bins": ["yt-dlp"]}, "version": "1.0.0"}}
---
# YouTube Discovery

Scrape recent YouTube videos from a configured creator list, analyze them for investment relevance, and send a digest to Telegram.

**Stop at first hard failure. Report errors to Telegram — never silently exit.**

## User Context (for analysis)
- Runs Clear Waters Capital LP — a China/HK equity long-term fund
- Focus areas: Chinese tech platforms, HK property, macro policy, US-China trade, EM currencies, Hong Kong financials
- Prioritise: policy shifts, earnings surprises, valuation re-rating calls, macro catalysts, management commentary
- Deprioritise: general US equities, crypto, lifestyle/personal finance, sports

## Step 1 — Read Config

```bash
cat /data/.openclaw/youtube-digest/creators.json
```
Extract the `channels` array. If file missing, send Telegram error and stop.

## Step 2 — Read Deduplication Log

```bash
cat /data/.openclaw/youtube-digest/seen.json
```
If file missing or malformed, treat as empty: `{"processed": []}`.

Extract all `video_id` values from `processed` entries where `processed_at` is within the last 72 hours. Build a set of seen IDs.

## Step 3 — Scan Each Channel for Recent Videos

For each channel handle in the list, run:

```bash
yt-dlp --get-id --flat-playlist --dateafter now-2days \
  --cookies /data/.openclaw/youtube-digest/cookies.txt \
  --force-ipv4 \
  --no-warnings \
  "https://www.youtube.com/@CHANNEL/videos"
```

Replace `@CHANNEL` with the handle (strip the @ for the URL: `@BloombergTV` → `https://www.youtube.com/@BloombergTV/videos`).

Collect all returned video IDs. Filter out any IDs already in the seen set.
If yt-dlp returns nothing for a channel, continue to the next — do not abort.

Also collect the video title for each ID:
```bash
yt-dlp --get-title --no-playlist "https://www.youtube.com/watch?v=VIDEO_ID"
```

## Step 4 — Fetch Transcripts

For each new video ID (filtered set), fetch transcript:

```bash
youtube-transcript-api VIDEO_ID --format text
```

If this fails (no captions, IP block), fall back to yt-dlp subtitle extraction:

```bash
yt-dlp --write-auto-subs --skip-download --sub-format ttml \
  --cookies /data/.openclaw/youtube-digest/cookies.txt \
  --force-ipv4 \
  --output "/tmp/yt-%(id)s" \
  "https://www.youtube.com/watch?v=VIDEO_ID"
cat /tmp/yt-VIDEO_ID*.ttml 2>/dev/null
```

Sleep 15–30 seconds (randomised) between each transcript fetch.

If both methods fail for a video: skip it and note it as "no transcript available".

## Step 5 — Analyze and Rank

Read all successfully-fetched transcripts. Using the user context above, rank every video by relevance to a China/HK equity investor. Consider:
- Direct mention of companies/sectors in the user's focus
- Policy, regulatory, or macro content that would affect HK/China equities
- Contrarian or high-conviction investment views worth investigating

Select the top 3 most relevant. For each, produce:
- `summary`: 2 sentences — what was said, what was the key point
- `why_relevant`: 1 sentence — why this matters specifically to a China/HK equity investor

If fewer than 3 videos have transcripts, use however many are available.
If 0 videos have transcripts, send: "📺 No transcripts available today. YouTube may be blocking the VPS — try refreshing cookies.txt." → Stop.
If 0 new videos found at all, send: "📺 No new videos today from your watchlist." → Stop.

## Step 6 — Save State

Write `/data/.openclaw/youtube-digest/state.json`:

```json
{
  "date": "YYYY-MM-DD",
  "options": {
    "A": {
      "video_id": "...",
      "title": "...",
      "channel": "@...",
      "url": "https://youtube.com/watch?v=...",
      "transcript": "...(full transcript text)...",
      "summary": "...",
      "why_relevant": "..."
    },
    "B": { ... },
    "C": { ... }
  }
}
```

Include the full transcript text in `state.json` — it will be needed by the deepdive skill.

## Step 7 — Update Seen Log

Add all processed video IDs (including those not selected in top 3) to `seen.json`.
Prune any entries with `processed_at` older than 72 hours.

```json
{
  "processed": [
    { "video_id": "abc123", "processed_at": "2026-03-11T08:00:00Z" }
  ]
}
```

## Step 8 — Send Telegram Digest

Send to Telegram channel 395 (the system will route this to the correct topic):

```
📺 YouTube Digest — {DATE}

A) {CHANNEL} — {TITLE}
"{SUMMARY}"
→ {WHY_RELEVANT}

B) {CHANNEL} — {TITLE}
"{SUMMARY}"
→ {WHY_RELEVANT}

C) {CHANNEL} — {TITLE}
"{SUMMARY}"
→ {WHY_RELEVANT}

Reply A, B or C to go deeper.
```

## Errors
| Situation | Action |
|-----------|--------|
| creators.json missing | Telegram: "creators.json not found. Please create it." Stop. |
| 0 new videos across all channels | Telegram: "No new videos today from your watchlist." Stop cleanly. |
| All transcript fetches fail | Telegram: "Could not fetch transcripts (IP block?). Try refreshing cookies.txt." Stop. |
| yt-dlp 403 / bot check | Include in error message: "Try refreshing /data/.openclaw/youtube-digest/cookies.txt" |
SKILLEOF
```
Expected: full SKILL.md contents echoed back.

- [ ] **Step 3: Verify the file is on disk and non-empty**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 wc -l \
  /data/.openclaw/skills/youtube-discovery/SKILL.md"
```
Expected: line count > 50.

---

### Task 5: Smoke-test youtube-discovery with a manual trigger

- [ ] **Step 1: Manually invoke the skill via OpenClaw agent**

In OpenClaw, send the message:
```
Run the youtube-discovery skill
```

- [ ] **Step 2: Verify state.json was written**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 python3 -c \
  'import json; d=json.load(open(\"/data/.openclaw/youtube-digest/state.json\")); \
   print(\"date:\", d[\"date\"]); \
   [print(k, \"->\", d[\"options\"][k][\"title\"][:50]) for k in d[\"options\"]]'"
```
Expected: date + 3 option titles printed.

- [ ] **Step 3: Verify seen.json was updated**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 python3 -c \
  'import json; d=json.load(open(\"/data/.openclaw/youtube-digest/seen.json\")); \
   print(len(d[\"processed\"]), \"videos processed\")'"
```
Expected: `N videos processed` where N > 0.

- [ ] **Step 4: Verify Telegram message arrived in channel 395**

Check your Telegram — the digest should appear in the YouTube topic (ch.395).

---

## Chunk 3: youtube-deepdive Skill

### Task 6: Write the youtube-deepdive SKILL.md

**Files:**
- Create: `/data/.openclaw/skills/youtube-deepdive/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 mkdir -p \
  /data/.openclaw/skills/youtube-deepdive"
```

- [ ] **Step 2: Write SKILL.md**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 "docker exec -i openclaw-f4no-openclaw-1 \
  tee /data/.openclaw/skills/youtube-deepdive/SKILL.md" << 'SKILLEOF'
---
name: youtube-deepdive
description: NotebookLM audio deep dive on a chosen YouTube video. Triggers when user replies A, B, or C after receiving a YouTube digest message.
metadata: {"openclaw": {"requires": {"bins": ["nlm", "ffmpeg"]}, "version": "1.0.0"}}
---
# YouTube Deep Dive

Generate a NotebookLM audio deep dive from a previously-sent YouTube digest choice (A, B, or C).

**Stop at first failure. Alert user via Telegram immediately. No retries unless asked.**

## Critical Rules
1. **nlm auth check first** — `nlm login --check`; abort if expired.
2. **`--confirm` required** on `nlm audio create` and `nlm audio delete` — not on `nlm notebook create`.
3. **Poll intervals: 120s**; max attempts: research=10×, import/audio=5×.
4. **Never use `nlm chat start`** — it opens an interactive REPL.
5. **ffmpeg full path:** `/data/linuxbrew/.linuxbrew/bin/ffmpeg`
6. **Always filter for 2026+ data** — state prompts as "2026 and beyond".

## Step 1 — Parse the User's Choice

Extract A, B, or C from the user's reply (case-insensitive, trim whitespace).
If the reply is not A, B, or C: respond "Please reply with A, B, or C." Stop.

## Step 2 — Read and Validate State

```bash
cat /data/.openclaw/youtube-digest/state.json
```

Validate:
- File exists (if not: "No digest found. Run the youtube-discovery job first.")
- `date` field matches today's date (if not: "Digest is from a previous day. Run discovery again for today.")
- Chosen option key exists in `options` (if not: "Invalid option. Only A/B/C available.")

Extract: `title`, `channel`, `url`, `transcript` for the chosen option.

## Step 3 — Generate Research Question

Read the full transcript. Generate one sharp, investor-focused research question that:
- Goes deeper than what the video itself covers
- Connects to 2026 developments and forward-looking catalysts
- Is specific enough to get precise NotebookLM results

Examples of good questions:
- "What is the current 2026 regulatory stance on Chinese internet platforms and what are the key catalysts for valuation re-rating of Tencent and Alibaba?"
- "What is Kyle Bass's thesis on HKD de-pegging, what macro conditions would trigger it, and what are the strongest counterarguments?"
- "How have US tariff changes in early 2026 affected Chinese export volumes and what is the consensus earnings impact on HK-listed manufacturers?"

## Step 4 — Acknowledge to Telegram

Send to Telegram channel 395:
```
🔍 Deep diving into: {TITLE} ({CHANNEL})

Question: "{GENERATED_QUESTION}"

Starting NotebookLM research — this takes 15–25 min. I'll send the audio when it's ready.
```

## Step 5 — Run NotebookLM Workflow

### 5a. Authenticate
```bash
nlm login --check
```
If auth expired: send "nlm authentication expired. Please re-auth." Stop.

### 5b. Create Notebook
```bash
nlm notebook create "{TITLE} - Investor Deep Dive"
```
Save the returned notebook ID.

### 5c. Start Research
```bash
nlm research start "{GENERATED_QUESTION} Focus on 2026 and beyond." \
  --notebook-id {NOTEBOOK_ID} \
  --mode deep
```
Poll every 120s, max 10 attempts (20 min total).
Status progression: `pending` → `running` → `completed` | `failed`

If rate limit ("no confirmation from API"): send "NotebookLM rate limit hit. Try again in 30 min." Stop.
If deep mode fails: fall back to fast mode, notify user.
If research fails after 20 min: send "Research timed out. Try again later." Stop.

Save the returned task ID.

### 5d. Import Sources
```bash
nlm research import {NOTEBOOK_ID} {TASK_ID}
```
Poll every 120s, max 5 attempts (10 min total).
Verify with: `nlm source list {NOTEBOOK_ID}`

### 5e. Generate Audio
```bash
nlm audio create {NOTEBOOK_ID} \
  --format deep_dive \
  --length long \
  --focus "{TITLE} — investor implications, key risks, 2026 outlook and catalysts" \
  --confirm
```
After the command starts: send "🎙 Audio generation started — usually 5–10 min in background."

### 5f. Download Audio
```bash
nlm download audio {NOTEBOOK_ID} \
  --output "/data/.openclaw/youtube-digest/audio/{SLUG}-deep-dive.mp3"
```
Where `{SLUG}` is the title lowercased with spaces replaced by hyphens, max 40 chars.

Poll for file existence every 60s, max 15 attempts (15 min total).

## Step 6 — Compress Audio

```bash
/data/linuxbrew/.linuxbrew/bin/ffmpeg \
  -i /data/.openclaw/youtube-digest/audio/{SLUG}-deep-dive.mp3 \
  -b:a 64k -ac 1 \
  /data/.openclaw/youtube-digest/audio/{SLUG}-compressed.mp3
```

Verify output file exists and is ≤ 50MB:
```bash
ls -lh /data/.openclaw/youtube-digest/audio/{SLUG}-compressed.mp3
```
If > 50MB: re-compress at 48k bitrate.

## Step 7 — Send to Telegram

Send the compressed `.mp3` file to Telegram channel 395 with caption:
```
🎧 {TITLE}
{CHANNEL} | Deep Dive

{GENERATED_QUESTION}
```

Then delete the uncompressed original to save space:
```bash
rm /data/.openclaw/youtube-digest/audio/{SLUG}-deep-dive.mp3
```

## Error Reference
| Error | Action |
|-------|--------|
| Auth expired | "nlm auth expired. Re-authenticate then try again." Stop. |
| Rate limit | "NotebookLM rate limit. Try again in 30 min." Stop. |
| Research > 20 min | Cancel task, send "Research timed out." Stop. |
| Audio > 15 min | Cancel, send "Audio generation timed out." Stop. |
| File > 50MB after compression | Re-compress at 48k: `-b:a 48k` |
| state.json stale/missing | "No digest for today. Run youtube-discovery first." Stop. |
SKILLEOF
```
Expected: full SKILL.md contents echoed back.

- [ ] **Step 3: Verify file is on disk**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 wc -l \
  /data/.openclaw/skills/youtube-deepdive/SKILL.md"
```
Expected: line count > 60.

---

### Task 7: Smoke-test youtube-deepdive

Prerequisite: Task 5 completed and `state.json` exists from today's discovery run.

- [ ] **Step 1: Verify nlm auth is current**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 nlm login --check"
```
Expected: auth valid message. If expired, re-authenticate before continuing.

- [ ] **Step 2: Send the trigger message in Telegram**

In your Telegram, reply to the YouTube digest message with just: `A`

- [ ] **Step 3: Verify OpenClaw picks up the reply and invokes the skill**

Watch OpenClaw's response in Telegram — it should send the "Deep diving into..." acknowledgement message within 30 seconds.

- [ ] **Step 4: Wait for audio generation (15–25 min)**

Monitor the Telegram channel 395 for the `🎧` message with the mp3 attachment.

- [ ] **Step 5: Verify the compressed file was created and cleaned up**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 ls -lh /data/.openclaw/youtube-digest/audio/"
```
Expected: only the `*-compressed.mp3` file(s) — no uncompressed originals.

---

## Chunk 4: Cron Job Setup

### Task 8: Add youtube-discovery cron job to jobs.json

**Files:**
- Modify: `/data/.openclaw/cron/jobs.json` (on container)

- [ ] **Step 1: Generate a UUID for the new job**

```bash
python3 -c "import uuid; print(uuid.uuid4())"
```
Copy this UUID — you'll use it in the next step. Example: `7e3f9a12-4b5c-6d7e-8f9a-0b1c2d3e4f5a`

- [ ] **Step 2: Stop the daemon**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "pm2 stop mission-control-acd"
```
Expected: `[PM2] Stopping mission-control-acd...`

- [ ] **Step 3: Read current jobs.json and note the current timestamp**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 cat /data/.openclaw/cron/jobs.json" \
  > /tmp/claw_jobs_backup.json
python3 -c "import json; d=json.load(open('/tmp/claw_jobs_backup.json')); print(len(d.get('jobs',[])), 'existing jobs')"
```
Expected: `11 existing jobs` (or current count). Backup is saved locally.

- [ ] **Step 4: Add the new job**

```bash
NOW_MS=$(python3 -c "import time; print(int(time.time() * 1000))")
NEW_UUID=$(python3 -c "import uuid; print(uuid.uuid4())")

python3 << PYEOF
import json

with open('/tmp/claw_jobs_backup.json') as f:
    data = json.load(f)

new_job = {
    "id": "$NEW_UUID",
    "name": "YouTube Discovery",
    "enabled": True,
    "createdAtMs": $NOW_MS,
    "updatedAtMs": $NOW_MS,
    "schedule": {
        "kind": "cron",
        "expr": "0 8 * * *",
        "tz": "Asia/Hong_Kong"
    },
    "sessionTarget": "isolated",
    "wakeMode": "skip",
    "payload": {
        "kind": "agentTurn",
        "message": "Run the youtube-discovery skill",
        "timeoutSeconds": 600
    },
    "delivery": {
        "mode": "announce",
        "channel": "telegram",
        "to": "telegram:-1003775453374:topic:395"
    }
}

data['jobs'].append(new_job)

with open('/tmp/claw_jobs_updated.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"New job added: {new_job['id']}")
print(f"Total jobs: {len(data['jobs'])}")
PYEOF
```
Expected: `New job added: <uuid>` and `Total jobs: 12` (or n+1).

- [ ] **Step 5: Write updated jobs.json back to container**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "cat > /data/.openclaw/cron/jobs.json" < /tmp/claw_jobs_updated.json
```

Wait — this writes via stdin redirect to the host, not into the container. Use the correct pattern:

```bash
cat /tmp/claw_jobs_updated.json | \
  ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec -i openclaw-f4no-openclaw-1 tee /data/.openclaw/cron/jobs.json > /dev/null"
```
Expected: no output (success).

- [ ] **Step 6: Verify the write was clean**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 python3 -c \
  'import json; d=json.load(open(\"/data/.openclaw/cron/jobs.json\")); \
   print(len(d[\"jobs\"]), \"jobs\"); \
   yt=[j for j in d[\"jobs\"] if \"YouTube\" in j[\"name\"]]; \
   print(\"YouTube job:\", yt[0][\"name\"] if yt else \"NOT FOUND\")'"
```
Expected: `12 jobs` (or n+1) and `YouTube job: YouTube Discovery`

- [ ] **Step 7: Restart the daemon**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "pm2 restart mission-control-acd"
```
Expected: `[PM2] Restarting mission-control-acd...`

- [ ] **Step 8: Verify job appears in cron list**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 openclaw cron list 2>/dev/null | grep -i youtube || \
   echo 'use: openclaw cron list'"
```
Expected: YouTube Discovery job listed with next run time.

- [ ] **Step 9: Commit the local backup and plan to git**

```bash
cd /Users/ren/Dev/clearwaters
git add docs/superpowers/specs/2026-03-11-youtube-digest-deepdive-design.md \
        docs/superpowers/plans/2026-03-11-youtube-digest-deepdive.md
git commit -m "docs: add YouTube digest + deep dive design spec and implementation plan"
```

---

## Chunk 5: End-to-End Verification

### Task 9: Full end-to-end test

- [ ] **Step 1: Manually trigger the cron job**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 openclaw cron run <youtube-discovery-job-id>"
```
Replace `<youtube-discovery-job-id>` with the UUID generated in Task 8.

- [ ] **Step 2: Check the run log**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 \
  cat /data/.openclaw/cron/runs/<job-id>.jsonl 2>/dev/null | tail -5"
```

- [ ] **Step 3: Verify Telegram digest received in channel 395**

Check Telegram for the `📺 YouTube Digest` message with A/B/C options.

- [ ] **Step 4: Reply with a choice and verify deep dive triggers**

Reply `B` (or any valid option) to the Telegram message.
Verify OpenClaw acknowledges and begins the deep dive.

- [ ] **Step 5: Verify audio arrives on Telegram**

Wait 15–25 min. Verify the `🎧` message + mp3 file arrives in channel 395.

- [ ] **Step 6: Verify cleanup**

```bash
ssh -i ~/.ssh/id_hostinger root@76.13.208.1 \
  "docker exec openclaw-f4no-openclaw-1 ls /data/.openclaw/youtube-digest/audio/"
```
Expected: only compressed file(s), no uncompressed originals.

---

## Reference: File Inventory

| File | Location | Purpose |
|------|----------|---------|
| `creators.json` | `/data/.openclaw/youtube-digest/creators.json` | Channel list — user edits to add/remove |
| `state.json` | `/data/.openclaw/youtube-digest/state.json` | Today's top 3 — written by discovery, read by deepdive |
| `seen.json` | `/data/.openclaw/youtube-digest/seen.json` | Dedup log — 72h rolling window |
| `cookies.txt` | `/data/.openclaw/youtube-digest/cookies.txt` | Browser cookies for YouTube VPS bypass |
| `audio/` | `/data/.openclaw/youtube-digest/audio/` | Compressed mp3 output |
| `youtube-discovery/SKILL.md` | `/data/.openclaw/skills/youtube-discovery/SKILL.md` | Discovery skill instructions |
| `youtube-deepdive/SKILL.md` | `/data/.openclaw/skills/youtube-deepdive/SKILL.md` | Deep dive skill instructions |

## Reference: Troubleshooting

| Problem | Fix |
|---------|-----|
| yt-dlp 403 errors | Refresh `cookies.txt` from browser |
| `youtube-transcript-api` blocked | Fall back to yt-dlp `--write-auto-subs` |
| nlm rate limit | Wait 30 min, retry |
| nlm auth expired | Run `nlm login` in the container |
| Audio file > 50MB | Re-compress at `-b:a 48k` |
| Deep dive doesn't trigger on reply | Check OpenClaw skill trigger description matches how replies arrive |
| Cron not running | Verify `wakeMode: "skip"` and `pm2 status mission-control-acd` |
