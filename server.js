/* ============================================================
   Player Overlay Server
   Tiny Node.js server that:
     1. Serves static files (overlay + controller)
     2. Relays player-selection events from the controller
        to the overlay via Server-Sent Events (SSE)

   Run:  node server.js
   Then open the controller on your phone at:
     http://<your-pc-ip>:3000/controller.html
   And add the OBS Browser Source:
     http://localhost:3000/player-card.html
   ============================================================ */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

/* --- SSE clients ------------------------------------------------ */
let sseClients = [];

function broadcast(data) {
  const msg = "data: " + JSON.stringify(data) + "\n\n";
  sseClients.forEach((res) => res.write(msg));
}

/* --- Current state ---------------------------------------------- */
let currentPlayer = null;   // most-recently selected player object
let overlayVisible = false; // show / hide state

/* --- MIME types ------------------------------------------------- */
const MIME = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
  ".mp4":  "video/mp4",
  ".webm": "video/webm",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
};

/* --- Server ----------------------------------------------------- */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  /* --- API: SSE stream for overlay ------------------------------ */
  if (url.pathname === "/api/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write("\n");

    // Send current state immediately so the overlay syncs on connect
    if (currentPlayer) {
      res.write("data: " + JSON.stringify({ type: "select", player: currentPlayer }) + "\n\n");
    }
    res.write("data: " + JSON.stringify({ type: "visibility", visible: overlayVisible }) + "\n\n");

    sseClients.push(res);
    req.on("close", () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
    return;
  }

  /* --- API: select a player ------------------------------------- */
  if (url.pathname === "/api/select" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const player = JSON.parse(body);
        currentPlayer = player;
        overlayVisible = true;
        broadcast({ type: "select", player });
        broadcast({ type: "visibility", visible: true });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400);
        res.end("Bad JSON");
      }
    });
    return;
  }

  /* --- API: hide overlay ---------------------------------------- */
  if (url.pathname === "/api/hide" && req.method === "POST") {
    overlayVisible = false;
    broadcast({ type: "visibility", visible: false });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  /* --- API: show overlay (re-show current player) --------------- */
  if (url.pathname === "/api/show" && req.method === "POST") {
    overlayVisible = true;
    broadcast({ type: "visibility", visible: true });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  /* --- Static files --------------------------------------------- */
  let filePath = path.join(__dirname, url.pathname === "/" ? "controller.html" : url.pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Player overlay server running at http://0.0.0.0:${PORT}`);
  console.log(`  Controller : http://localhost:${PORT}/controller.html`);
  console.log(`  Overlay    : http://localhost:${PORT}/player-card.html`);
  console.log(`\nOpen the controller URL on your phone (same Wi-Fi).`);
});
