# Player Card Overlay

A broadcast-style web overlay that displays a player card with a looping video, name, jersey number, grade, height, and weight. Comes with a **mobile controller** so you can select the active player from your phone during a broadcast.

## How It Works

- **`player-card.html`** — the overlay (add as an OBS Browser Source)
- **`controller.html`** — mobile-friendly page to select players (open on your phone)
- **`server.js`** — tiny Node.js relay that syncs the controller → overlay in real-time
- **`roster.json`** — your team's player data

Same pattern as a scoreboard overlay + controller — your phone talks to the server, the server pushes updates to the OBS overlay instantly.

## Quick Start

1. **Edit `roster.json`** with your players' info (name, number, grade, height, weight, video path).

2. **Start the server** on your streaming PC:
   ```bash
   node server.js
   ```

3. **Add the overlay in OBS:**
   - Add a **Browser Source**
   - URL: `http://localhost:3000/player-card.html`
   - Width: `1920`, Height: `1080`
   - Check **"Shutdown source when not visible"**

4. **Open the controller on your phone:**
   - Go to `http://<your-pc-ip>:3000` on your phone (same Wi-Fi)
   - Tap a player to show their card on stream
   - Use the **Show** / **Hide** buttons to toggle the overlay

## roster.json Format

```json
[
  {
    "id": "john-smith",
    "name": "John Smith",
    "number": "23",
    "grade": "Junior",
    "height": "6'2\"",
    "weight": "185 lbs",
    "video": "videos/john-smith.mp4"
  }
]
```

- `id` — unique identifier (used internally)
- `video` — path to a short looping clip (mp4/webm), or empty string for no video

## Player Videos

Put short video clips (2–5 seconds, looping) in a `videos/` folder. Reference them in `roster.json`. The video plays on a loop in the left panel of the card.

## Standalone Mode (no server)

The overlay also works as a plain static file with URL query parameters — useful for a quick one-off without the controller:

```
player-card.html?name=John+Smith&number=23&grade=Junior&height=6'2"&weight=185+lbs&video=videos/john.mp4&demo=1
```

## URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `name` | Player's full name | `John+Smith` |
| `number` | Jersey number | `23` |
| `grade` | Grade / year | `Junior` |
| `height` | Height | `6'2"` |
| `weight` | Weight | `185+lbs` |
| `video` | Path to video (mp4/webm) | `videos/john.mp4` |
| `accent` | Hex accent color (no `#`) | `ff5722` |
| `demo` | `1` = dark bg for previewing outside OBS | `1` |

## Customization

- **Accent color** — set `accent` URL param, or edit `--accent` in `player-card.css`
- **Layout / fonts** — edit `player-card.css`
- **Animation** — the card slides in from the left; timing is in `player-card.css`
