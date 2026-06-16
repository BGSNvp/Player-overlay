# Player Card Overlay

A broadcast-style web overlay that displays a player card with a looping video, name, jersey number, grade, height, and weight. Comes with a **mobile controller** to select the active player from your phone during a broadcast. Uses **Firebase Firestore** for real-time sync — same setup as the BGSN scoreboard.

## How It Works

- **`player-card.html`** — the overlay (add as an OBS Browser Source)
- **`controller.html`** — mobile-friendly page to select/manage players (open on your phone)
- **`player-card.css`** — overlay styles

The controller writes to Firestore, the overlay listens with `onSnapshot` — instant updates over the internet, no local server needed.

## Quick Start

1. **Host the files** — GitHub Pages, Netlify, or any static host.

2. **Open the controller** on your phone and add your players via the **Manage Roster** tab.

3. **Add the overlay in OBS:**
   - Add a **Browser Source**
   - URL: `https://<your-host>/player-card.html`
   - Width: `1920`, Height: `1080`
   - Check **"Shutdown source when not visible"**

4. **During the broadcast**, open the controller on your phone:
   - Tap a player to show their card on stream
   - Use **Show** / **Hide** to toggle the overlay

## Controller Features

- **Select tab** — tap a player to push them live on the overlay
- **Manage Roster tab** — add, edit, and delete players
- **Show / Hide buttons** — toggle overlay visibility without changing the player
- Roster is stored in Firestore — persists across devices and sessions

## Firebase

Uses the same Firebase project as the BGSN scoreboard (`bgsn-scoreboard`). Data is stored in the `playerOverlay` collection:
- `playerOverlay/live` — currently displayed player + visibility
- `playerOverlay/roster` — full player list

## Customization

- **Accent color** — add `?accent=ff5722` to the overlay URL, or edit `--accent` in `player-card.css`
- **Demo mode** — add `?demo=1` to the overlay URL to see a dark background for previewing outside OBS
- **Layout / fonts / animation** — edit `player-card.css`
