# Player Card Overlay

A broadcast-style web overlay that displays a player card with a looping video, name, jersey number, grade, height, and weight. Designed for use as an **OBS Browser Source** (transparent background) during livestreams.

![preview](https://github.com/user-attachments/assets/placeholder)

## Features

- **Looping video** of the player (left panel)
- **Jersey number badge** overlaid on the video
- **Player stats** — name, grade, height, weight
- **Transparent background** — composites cleanly in OBS
- **Slide-in animation** on load
- **URL query-param driven** — swap players by changing the URL, no code edits needed
- **Custom accent color** — match your school/team colors
- **No build step** — plain HTML / CSS / JS

## Quick Start

Serve the files with any static server:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Open in a browser:

```
http://localhost:8000/player-card.html?name=Marcus+Johnson&number=23&grade=Junior&height=6'2"&weight=185+lbs&video=clips/marcus.mp4&demo=1
```

## URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `name` | Player's full name | `Marcus+Johnson` |
| `number` | Jersey number | `23` |
| `grade` | Grade / year | `Junior` |
| `height` | Height | `6'2"` |
| `weight` | Weight | `185+lbs` |
| `video` | URL or path to a short video (mp4 / webm) | `clips/marcus.mp4` |
| `accent` | Hex accent color (without `#`) | `ff5722` |
| `demo` | Set to `1` to show a dark background for previewing outside OBS | `1` |

## OBS Setup

1. **Host the files** — GitHub Pages, Netlify, or any static host. Or run a local server on your streaming PC.
2. **Add a Browser Source** in OBS.
3. Set the **URL** to your hosted `player-card.html` with the appropriate query params for the player.
4. Set the **Width** to `1920` and **Height** to `1080` (or match your canvas).
5. Make sure **"Shutdown source when not visible"** is checked so the slide-in animation replays each time you show the source.

To switch players, just update the URL in the Browser Source properties.

## Hosting on GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages** and set the source to the `main` branch.
3. Your overlay will be live at `https://<username>.github.io/player-overlay/player-card.html?name=...`

## Customization

- Edit `player-card.css` to change fonts, sizes, card layout, or animation timing.
- The `--accent` CSS variable controls the highlight color (label text, number badge, gradient stripe). Override it with the `accent` URL param or in CSS.
- Add a `.hidden` class to `#playerCard` via JavaScript to trigger the slide-out animation for dismissing the card.
