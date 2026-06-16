/* ============================================================
   Player Card Overlay  –  reads URL query-params and populates
   the card.  Designed for OBS Browser Source usage.

   Query parameters:
     name     – player full name          (e.g. "John Smith")
     number   – jersey number             (e.g. "23")
     grade    – grade / year              (e.g. "Junior")
     height   – height                    (e.g. "6'2\"")
     weight   – weight                    (e.g. "185 lbs")
     video    – URL to a short video clip (mp4 / webm)
     accent   – optional hex accent color (e.g. "ff5722")
     demo     – if "1", adds a dark bg so you can preview
                outside OBS

   Example:
     player-card.html?name=John+Smith&number=23&grade=Junior
       &height=6'2"&weight=185+lbs&video=clips/john.mp4
   ============================================================ */

(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);

  /* --- Populate fields --- */
  setText("playerName", params.get("name") || "Player Name");
  setText("playerNumber", "#" + (params.get("number") || "00"));
  setText("playerGrade", params.get("grade") || "—");
  setText("playerHeight", params.get("height") || "—");
  setText("playerWeight", params.get("weight") || "—");

  /* --- Video --- */
  const videoSrc = params.get("video");
  const videoEl = document.getElementById("playerVideo");
  const videoWrap = document.querySelector(".card-video");

  if (videoSrc) {
    videoEl.src = videoSrc;
    videoEl.load();
  } else {
    videoEl.remove();
    videoWrap.classList.add("no-video");
  }

  /* --- Optional accent color override --- */
  const accent = params.get("accent");
  if (accent) {
    const hex = accent.replace(/^#/, "");
    document.querySelector(".player-card")
      .style.setProperty("--accent", "#" + hex);
  }

  /* --- Demo background toggle --- */
  if (params.get("demo") === "1") {
    document.body.classList.add("demo");
  }

  /* --- Helpers --- */
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }
})();
