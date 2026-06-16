/* ============================================================
   Player Card Overlay

   Two modes:
   1. Server mode  – connects to the Node server via SSE and
      updates in real-time when the controller selects a player.
      (Used when served by server.js)
   2. Standalone   – reads player data from URL query params.
      (Used as a plain static file / OBS Browser Source with
       a direct URL like ?name=...&number=...&video=...)

   The script auto-detects which mode to use: if /api/events
   is reachable it uses server mode, otherwise standalone.
   ============================================================ */

(function () {
  "use strict";

  var card = document.getElementById("playerCard");
  var params = new URLSearchParams(window.location.search);

  /* --- Demo background toggle --- */
  if (params.get("demo") === "1") {
    document.body.classList.add("demo");
  }

  /* --- Optional accent color override --- */
  var accentParam = params.get("accent");
  if (accentParam) {
    var hex = accentParam.replace(/^#/, "");
    card.style.setProperty("--accent", "#" + hex);
  }

  /* --- Try server mode, fall back to standalone --- */
  tryServerMode();

  /* ========================================================== */

  function tryServerMode() {
    var evtSource;
    try {
      evtSource = new EventSource("/api/events");
    } catch (e) {
      standaloneMode();
      return;
    }

    var connected = false;
    var timeout = setTimeout(function () {
      if (!connected) {
        evtSource.close();
        standaloneMode();
      }
    }, 2000);

    evtSource.onopen = function () {
      connected = true;
      clearTimeout(timeout);
      // Start hidden until controller sends a player
      card.classList.add("hidden");
      card.style.display = "none";
    };

    evtSource.onmessage = function (e) {
      var msg;
      try { msg = JSON.parse(e.data); } catch (_) { return; }

      if (msg.type === "select" && msg.player) {
        populateCard(msg.player);
      }

      if (msg.type === "visibility") {
        if (msg.visible) {
          showCard();
        } else {
          hideCard();
        }
      }
    };

    evtSource.onerror = function () {
      if (!connected) {
        clearTimeout(timeout);
        evtSource.close();
        standaloneMode();
      }
    };
  }

  function standaloneMode() {
    populateCard({
      name: params.get("name") || "Player Name",
      number: params.get("number") || "00",
      grade: params.get("grade") || "\u2014",
      height: params.get("height") || "\u2014",
      weight: params.get("weight") || "\u2014",
      video: params.get("video") || "",
    });
    showCard();
  }

  /* --- Populate the card DOM --- */
  function populateCard(p) {
    setText("playerName", p.name || "Player Name");
    setText("playerNumber", "#" + (p.number || "00"));
    setText("playerGrade", p.grade || "\u2014");
    setText("playerHeight", p.height || "\u2014");
    setText("playerWeight", p.weight || "\u2014");

    var videoEl = document.getElementById("playerVideo");
    var videoWrap = document.querySelector(".card-video");

    if (p.video) {
      if (!videoEl) {
        videoEl = document.createElement("video");
        videoEl.id = "playerVideo";
        videoEl.autoplay = true;
        videoEl.loop = true;
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoWrap.prepend(videoEl);
        videoWrap.classList.remove("no-video");
      }
      videoEl.src = p.video;
      videoEl.load();
    } else {
      if (videoEl) { videoEl.remove(); }
      videoWrap.classList.add("no-video");
    }
  }

  /* --- Show / hide with animation --- */
  function showCard() {
    card.style.display = "flex";
    card.classList.remove("hidden");
    // Re-trigger slide-in animation
    card.style.animation = "none";
    card.offsetHeight; // force reflow
    card.style.animation = "";
  }

  function hideCard() {
    card.classList.add("hidden");
    // After slide-out animation, hide completely
    setTimeout(function () {
      card.style.display = "none";
    }, 500);
  }

  /* --- Helpers --- */
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }
})();
