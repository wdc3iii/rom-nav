/* RoM-Nav project page. Vanilla, no dependencies beyond KaTeX.
   Everything here degrades to a working page if it never runs. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- math */
  function renderMath() {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  }
  if (document.readyState === "complete") renderMath();
  else window.addEventListener("load", renderMath);

  /* ------------------------------------------------- media swap helper
     A hidden <video> with a src still downloads, so the selectors replace
     src + poster and call load() rather than toggling visibility. */
  function swapVideo(video, name) {
    if (!video) return;
    video.pause();
    video.src = "media/video/" + name + ".mp4";
    video.poster = "media/poster/" + name + ".webp";
    video.load();
  }

  function bindPicker(picker, onSelect) {
    if (!picker) return;
    var buttons = Array.prototype.slice.call(picker.querySelectorAll("button"));
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-selected", String(b === btn)); });
        onSelect(btn);
      });
    });
  }

  /* ---------------------------------------------------------------- CBF */
  var CBF_CAPTIONS = {
    "cbf-indistribution":
      "<b>In-distribution.</b> Solid, convex obstacles of the kind the policy trained against. Neither arm collides.",
    "cbf-ood":
      "<b>Out-of-distribution.</b> Ladders with cardboard tubes protruding from them. The unfiltered policy collides on 2 of 10 trials; the filtered policy on none.",
    "cbf-adversarial":
      "<b>Adversarial.</b> Thin cardboard tubes hung at head height, chosen for their exceptionally small LiDAR cross-section. The unfiltered policy collides on 4 of 10 trials; the filtered policy on none."
  };

  var cbfVideo = document.getElementById("cbf-video");
  var cbfCaption = document.getElementById("cbf-caption");

  bindPicker(document.querySelector('.picker[aria-label="Obstacle environment"]'), function (btn) {
    var clip = btn.dataset.clip;
    swapVideo(cbfVideo, clip);
    if (cbfCaption && CBF_CAPTIONS[clip]) cbfCaption.innerHTML = CBF_CAPTIONS[clip];
  });

  /* ----------------------------------------------------------- hardware
     Figures below are measured from each run's recorded bag (3D path
     length, pelvis z delta, engaged duration, final distance to goal). */
  var TRIAL_CAPTIONS = {
    "trial-lab":
      "<b>Cluttered lab.</b> 36.6&nbsp;m of path over 63&nbsp;s, threading mats, crates and equipment on a single level. Stops 0.03&nbsp;m from the commanded goal.",
    "trial-gt":
      "<b>Two-story stairwell.</b> 47.6&nbsp;m of path and +7.9&nbsp;m of climb in 72&nbsp;s, up a stairwell with thin wire railings — close to invisible to LiDAR. Stops 0.10&nbsp;m from the goal.",
    "trial-ann":
      "<b>Building entry climb.</b> 51.4&nbsp;m of path and +8.9&nbsp;m of climb in 78&nbsp;s, entering a building from outside and continuing up through it. Stops 0.06&nbsp;m from the goal.",
    "trial-gtback":
      "<b>Long-horizon outdoor.</b> 101.3&nbsp;m of path over 125&nbsp;s, avoiding tables, cliff edges and railings. The goal sat 54&nbsp;m away at engagement — beyond the 40&nbsp;m range clamp, so the commanded goal was held at the clamp boundary for much of the run. Stops 0.03&nbsp;m from the goal."
  };

  var trialVideo = document.getElementById("trial-video");
  var trialCaption = document.getElementById("trial-caption");

  bindPicker(document.querySelector('.picker[aria-label="Hardware trial"]'), function (btn) {
    var trial = btn.dataset.trial;
    swapVideo(trialVideo, trial);
    if (trialCaption && TRIAL_CAPTIONS[trial]) trialCaption.innerHTML = TRIAL_CAPTIONS[trial];
  });

  /* ------------------------------------------------------------ bibtex */
  var copyBtn = document.getElementById("copy-bib");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      var text = document.getElementById("bibtex").textContent;
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.textContent = "copied";
        setTimeout(function () { copyBtn.textContent = "copy"; }, 1600);
      });
    });
  }

  /* ---------------------------------------------- youtube click-to-load
     No third-party request is made until the visitor asks for one. */
  var facade = document.getElementById("yt-facade");
  function loadYouTube() {
    var id = facade.dataset.yt;
    if (!id || id.indexOf("REPLACE") === 0) return;
    var frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    frame.title = "Supplementary video";
    frame.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;
    facade.replaceChildren(frame);
    facade.style.cursor = "default";
  }
  if (facade) {
    facade.addEventListener("click", loadYouTube);
    facade.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); loadYouTube(); }
    });
  }

  /* --------------------------------------------------------- scroll spy */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var visible = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      // Highlight the topmost section currently on screen.
      var active = sections.filter(function (s) { return visible.has(s.id); })[0];
      navLinks.forEach(function (a) {
        a.classList.toggle("current", !!active && a.getAttribute("href") === "#" + active.id);
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
