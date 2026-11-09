const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const bnDigits = "০১২৩৪৫৬৭৮৯";

export function installPolish({ getLanguage, getPlayableGames, startPlayable }) {
  const language = () => getLanguage() === "bn";
  const text = (bn, en) => language() ? bn : en;
  const addEffect = (name, detail = {}) => window.dispatchEvent(new CustomEvent(name, { detail }));

  installPageTurn();
  installScrollReveals();
  installImageSkeletons();
  installAmbientScene();
  installLoadingPencil();
  installSoundToggle();
  installSoundHaptics();
  installRandomGame();
  installGameCountdown();
  installResults();
  installScoreCounting();
  installPwa();
  installGamepad();
  installKeyboardHints();

  function installPageTurn() {
    let previous = (location.hash || "#home").slice(1);
    const order = ["home", "play", "arcadeCorner", "memories", "about"];
    const turn = (next) => {
      if (reducedMotion.matches || next === previous) { previous = next; return; }
      const sheet = document.createElement("div");
      const direction = order.indexOf(next) >= order.indexOf(previous) ? "forward" : "back";
      sheet.className = `page-turn-sheet page-turn-${direction}`;
      sheet.setAttribute("aria-hidden", "true");
      document.body.append(sheet);
      sheet.addEventListener("animationend", () => sheet.remove(), { once: true });
      setTimeout(() => sheet.remove(), 720);
      previous = next;
    };
    window.addEventListener("hashchange", () => turn((location.hash || "#home").slice(1)));
  }

  function installScrollReveals() {
    if (!("IntersectionObserver" in window)) return;
    const targets = ".home-menu-card,.play-group,.play-card,.game-card,.cabinet-card,.arcade-memory-card,.memory-photo,.cta-paper";
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -28px 0px" });
    const scan = () => document.querySelectorAll(`${targets}:not([data-reveal-ready])`).forEach((item, index) => {
      item.dataset.revealReady = "true";
      item.style.setProperty("--reveal-delay", `${(index % 6) * 40}ms`);
      item.classList.add("reveal-item");
      observer.observe(item);
    });
    scan();
    const roots = ["#playGrid", "#gameGrid", "#cabinetGrid", "#memoryPhotos"]
      .map((selector) => document.querySelector(selector)).filter(Boolean);
    const observeAdded = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(targets) && !node.hasAttribute("data-reveal-ready")) {
          node.dataset.revealReady = "true"; node.style.setProperty("--reveal-delay", "40ms"); node.classList.add("reveal-item"); observer.observe(node);
        }
        node.querySelectorAll?.(`${targets}:not([data-reveal-ready])`).forEach((item, index) => {
          item.dataset.revealReady = "true"; item.style.setProperty("--reveal-delay", `${(index % 6) * 40}ms`); item.classList.add("reveal-item"); observer.observe(item);
        });
      }));
    });
    roots.forEach((root) => observeAdded.observe(root, { childList: true }));
  }

  function installImageSkeletons() {
    const mark = (image) => {
      const frame = image.closest(".memory-photo,.arcade-memory-art");
      if (!frame) return;
      frame.classList.add(image.naturalWidth ? "image-loaded" : "image-missing");
    };
    document.querySelectorAll(".memory-photo img,.arcade-memory-art img").forEach((image) => {
      if (image.complete) mark(image);
      else { image.addEventListener("load", () => mark(image), { once: true }); image.addEventListener("error", () => mark(image), { once: true }); }
    });
    document.addEventListener("load", (event) => { if (event.target instanceof HTMLImageElement) mark(event.target); }, true);
    document.addEventListener("error", (event) => { if (event.target instanceof HTMLImageElement) mark(event.target); }, true);
  }

  function installAmbientScene() {
    const kite = document.querySelector(".scene-art path.ambient-kite");
    if (!kite) return;
    const pause = () => document.documentElement.classList.toggle("ambient-paused", document.hidden);
    document.addEventListener("visibilitychange", pause);
    pause();
  }

  function installLoadingPencil() {
    const progress = document.querySelector(".loading-track span");
    if (progress) progress.setAttribute("aria-label", text("পাতা আঁকা হচ্ছে", "Drawing the page"));
  }

  function installSoundToggle() {
    const languageButton = document.querySelector("#languageBtn");
    languageButton?.addEventListener("click", () => {
      languageButton.classList.remove("is-jiggling"); void languageButton.offsetWidth; languageButton.classList.add("is-jiggling");
    });
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "soundToggle";
    toggle.className = "language sound-toggle";
    toggle.setAttribute("aria-pressed", "false");
    document.querySelector("#languageBtn")?.insertAdjacentElement("beforebegin", toggle);
    let enabled = false;
    let context = null;
    try { enabled = localStorage.getItem("agerdin-sfx") === "on"; localStorage.removeItem("agerdin-background-music"); } catch { /* optional preference */ }
    const render = () => {
      toggle.textContent = enabled ? text("♪ গেমের শব্দ চালু", "♪ Game sound on") : text("♪ গেমের শব্দ বন্ধ", "♪ Game sound off");
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.setAttribute("aria-label", enabled ? text("গেমের শব্দ বন্ধ করুন", "Turn game sounds off") : text("গেমের শব্দ চালু করুন", "Turn game sounds on"));
    };
    const tone = (kind = "tap") => {
      if (!enabled) return;
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      context ||= new Audio();
      if (context.state === "suspended") context.resume().catch(() => {});
      const now = context.currentTime;
      if (kind === "paper") {
        const length = Math.floor(context.sampleRate * .055), buffer = context.createBuffer(1, length, context.sampleRate), samples = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / length);
        const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
        source.buffer = buffer; filter.type = "lowpass"; filter.frequency.value = 1150;
        gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.09, now + .008); gain.gain.exponentialRampToValueAtTime(.0001, now + .06);
        source.connect(filter); filter.connect(gain); gain.connect(context.destination); source.start(now); return;
      }
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const presets = { tap: [760, .045, "sine"], marble: [510, .09, "triangle"], carrom: [190, .11, "triangle"], chime: [880, .18, "sine"], paper: [330, .06, "square"] };
      const [frequency, duration, wave] = presets[kind] || presets.tap;
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, now);
      if (kind === "chime") oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(kind === "paper" ? .055 : kind === "chime" ? .105 : .085, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.start(now); oscillator.stop(now + duration + .01);
    };
    toggle.addEventListener("click", () => {
      enabled = !enabled;
      try { localStorage.setItem("agerdin-sfx", enabled ? "on" : "off"); } catch { /* optional preference */ }
      render();
      toggle.classList.remove("is-jiggling");
      void toggle.offsetWidth;
      toggle.classList.add("is-jiggling");
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest("dialog[open]")) return;
      if (event.target.closest(".play-option,.kata-cell,.ludo-die,.bantumi-pit,.stone-choice")) tone("marble");
      else if (event.target.closest(".carrom-shot")) tone("carrom");
      else if (event.target.closest("#introStart,#snakeStart,#brickStart,#spaceStart,#rapidStart,#classicStart")) tone("paper");
    }, true);
    document.addEventListener("agerdin:hit", () => { if (document.querySelector("dialog[open]")) tone("tap"); });
    document.addEventListener("agerdin:game-end", (event) => { if (document.querySelector("dialog[open]")) tone(event.detail?.result === "win" ? "chime" : "paper"); });
    document.addEventListener("agerdin:language", render);
    document.addEventListener("agerdin:sound-state", (event) => {
      enabled = Boolean(event.detail?.enabled);
      try { localStorage.setItem("agerdin-sfx", enabled ? "on" : "off"); } catch { /* optional preference */ }
      render();
    });
    render();
  }

  function installSoundHaptics() {
    const vibrate = (pattern) => { if (typeof navigator.vibrate === "function") navigator.vibrate(pattern); };
    document.addEventListener("agerdin:hit", () => vibrate(18));
    document.addEventListener("agerdin:game-end", (event) => vibrate(event.detail?.result === "win" ? [24, 40, 50] : 22));
  }

  function installRandomGame() {
    const button = document.createElement("button");
    button.type = "button";
    button.id = "randomGame";
    button.className = "random-game-button";
    button.innerHTML = '<span aria-hidden="true">↻</span><span></span>';
    document.querySelector("#play .section-head")?.append(button);
    const label = () => { button.lastElementChild.textContent = text("আজকের খেলাটা বেছে দিন", "Pick a game for me"); button.setAttribute("aria-label", text("এলোমেলো একটি খেলা বেছে নিন", "Pick a random playable game")); };
    label();
    document.addEventListener("agerdin:language", label);
    button.addEventListener("click", () => {
      button.classList.remove("is-shaking"); void button.offsetWidth; button.classList.add("is-shaking");
      const games = getPlayableGames();
      const chosen = games[Math.floor(Math.random() * games.length)];
      if (chosen?.playable) setTimeout(() => startPlayable(chosen.playable), reducedMotion.matches ? 0 : 280);
    });
  }

  function installGameCountdown() {
    let active = false;
    document.addEventListener("click", (event) => {
      const button = event.target.closest('#introStart,[id$="Start"],#racerReadyStart,#handBatFirst,#handBowlFirst');
      if (!button || button.dataset.countdownPass || active || !button.isConnected) return;
      const dialog = button.closest("dialog");
      if (!dialog) return;
      event.preventDefault(); event.stopImmediatePropagation();
      active = true;
      const overlay = document.createElement("div");
      overlay.className = "chalk-countdown";
      overlay.setAttribute("aria-live", "assertive");
      overlay.setAttribute("role", "status");
      dialog.append(overlay);
      const frames = language() ? ["৩", "২", "১", "চলো!"] : ["3", "2", "1", "Go!"];
      let index = 0;
      const delay = reducedMotion.matches ? 80 : 460;
      const tick = () => {
        if (!button.isConnected || !dialog.open) { overlay.remove(); active = false; return; }
        overlay.textContent = frames[index];
        overlay.classList.remove("count-pop"); void overlay.offsetWidth; overlay.classList.add("count-pop");
        index += 1;
        if (index < frames.length) setTimeout(tick, delay);
        else setTimeout(() => { overlay.remove(); button.dataset.countdownPass = "true"; button.click(); delete button.dataset.countdownPass; active = false; }, delay);
      };
      tick();
    }, true);
  }

  function installResults() {
    const handled = new WeakSet();
    const addResultButton = (container) => {
      if (!container || handled.has(container)) return;
      const actions = container.querySelector(".result-actions,.retro-control-group,.retro-controls") || container;
      if (actions.querySelector("[data-share-score]")) { handled.add(container); return; }
      const button = document.createElement("button");
      button.type = "button"; button.dataset.shareScore = "true"; button.className = "share-score-button";
      button.textContent = text("ফল শেয়ার করুন", "Share score");
      button.addEventListener("click", () => shareScore(container));
      actions.append(button); handled.add(container);
    };
    const observer = new MutationObserver(() => {
      document.querySelectorAll(".result-card").forEach((card) => {
        addResultButton(card);
        if (card.dataset.paperBits) return;
        card.dataset.paperBits = "true";
        const result = card.classList.contains("result-win") ? "win" : card.classList.contains("result-loss") ? "loss" : "draw";
        addEffect("agerdin:game-end", { result });
        if (result !== "draw") paperConfetti(card);
        if (result === "loss") shakeScreen(card);
        if (result === "win") card.classList.add("result-chime");
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
    document.addEventListener("agerdin:game-end", (event) => {
      const activeDialog = document.querySelector("dialog[open]");
      const inPageGame = ["hand", "penfight", "kata", "notebook-cricket", "paper-football", "ludo", "bantumi", "five-stones", "odd-even"].includes(event.detail?.game);
      if (inPageGame) return;
      const outcome = activeDialog?.querySelector("[data-game-result],.retro-controls,.retro-control-group");
      if (activeDialog && outcome) {
        addResultButton(activeDialog);
        if (event.detail?.result === "win") paperConfetti(activeDialog);
      }
      if (event.detail?.result === "loss") shakeScreen(activeDialog);
    });
    document.addEventListener("agerdin:hit", () => shakeScreen(document.querySelector("dialog[open]")));
    document.addEventListener("agerdin:language", () => document.querySelectorAll("[data-share-score]").forEach((button) => { button.textContent = text("ফল শেয়ার করুন", "Share score"); }));
  }

  function paperConfetti(parent) {
    if (reducedMotion.matches || !parent) return;
    const canvas = document.createElement("canvas");
    canvas.className = "paper-confetti"; canvas.setAttribute("aria-hidden", "true");
    const rect = parent.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * devicePixelRatio));
    canvas.height = Math.max(1, Math.round(Math.min(rect.height, 460) * devicePixelRatio));
    parent.append(canvas);
    const ctx = canvas.getContext("2d"); if (!ctx) { canvas.remove(); return; }
    const dpr = devicePixelRatio || 1; ctx.scale(dpr, dpr);
    const width = canvas.width / dpr, height = canvas.height / dpr;
    const colors = ["#a64f36", "#d3b96e", "#6d8057", "#e8dcc1", "#7d6150"];
    const particles = Array.from({ length: 40 }, () => ({ x: Math.random() * width, y: -12 - Math.random() * 120, vy: 1.4 + Math.random() * 2.5, vx: (Math.random() - .5) * 1.5, spin: Math.random() * 6, size: 4 + Math.random() * 6, color: colors[Math.floor(Math.random() * colors.length)] }));
    const start = performance.now();
    const draw = (now) => {
      const elapsed = now - start; ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.spin += .04; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.spin); ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * .65); ctx.restore(); });
      canvas.style.opacity = String(Math.max(0, 1 - elapsed / 1900));
      if (elapsed < 1900) requestAnimationFrame(draw); else canvas.remove();
    };
    requestAnimationFrame(draw);
  }

  function shakeScreen(target) {
    if (!target || reducedMotion.matches) return;
    target.classList.remove("is-shaking-hit"); void target.offsetWidth; target.classList.add("is-shaking-hit");
    target.addEventListener("animationend", () => target.classList.remove("is-shaking-hit"), { once: true });
  }

  async function shareScore(container) {
    const scoreNode = container.querySelector("[id$='Score'],.pen-match-vs,.notebook-scorecard,.result-score") || container.querySelector(".retro-scorebar,[aria-live]");
    const score = scoreNode?.textContent?.trim().replace(/\s+/g, " ") || text("এক দারুণ খেলা", "A good game played");
    const title = container.querySelector("h2,h3,strong")?.textContent?.trim() || text("আগেরদিনের খেলা", "Agerdin game");
    const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#292824"; ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = "#eee4cf"; ctx.fillRect(34, 34, 1132, 562);
    ctx.strokeStyle = "#b7a47e"; ctx.lineWidth = 2; ctx.strokeRect(55, 55, 1090, 520);
    ctx.fillStyle = "#a64f36"; ctx.beginPath(); ctx.arc(1020, 150, 48, 0, Math.PI * 2); ctx.fill();
    await document.fonts?.ready;
    ctx.fillStyle = "#f6edda"; ctx.font = 'bold 48px "Agerdin Sans",sans-serif'; ctx.fillText("আগেরদিন · Agerdin", 92, 130);
    ctx.fillStyle = "#6d644f"; ctx.font = '28px "Agerdin Sans",sans-serif'; ctx.fillText(text("আজকের খেলা", "Today’s game"), 96, 220);
    ctx.fillStyle = "#292824"; ctx.font = 'bold 58px "Agerdin Serif",serif'; ctx.fillText(title.slice(0, 28), 92, 320);
    ctx.fillStyle = "#a64f36"; ctx.font = 'bold 38px "Agerdin Sans",sans-serif'; ctx.fillText(score.slice(0, 48), 96, 410);
    ctx.fillStyle = "#7b715d"; ctx.font = '22px "Agerdin Sans",sans-serif'; ctx.fillText(text("শৈশবের খেলা, আবার একসাথে।", "Childhood games, played again."), 96, 500);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png")); if (!blob) return;
    const file = new File([blob], "agerdin-score.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title, text: `${title} · ${score}` });
      else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "agerdin-score.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
    } catch (error) { if (error.name !== "AbortError") console.error("Could not share score", error); }
  }

  function installScoreCounting() {
    const watched = new WeakSet();
    const digits = (value) => {
      const match = String(value).match(/[০-৯\d][০-৯\d,]*/);
      return match ? Number(match[0].replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d))).replace(/,/g, "")) : 0;
    };
    const renderDigits = (n, useBn) => String(Math.max(0, Math.floor(n))).replace(/\d/g, (d) => useBn ? bnDigits[Number(d)] : d);
    const animate = (node) => {
      const currentText = node.textContent || "";
      const current = digits(currentText);
      const previous = Number(node.dataset.scoreValue ?? current);
      node.dataset.scoreValue = String(current);
      if (!current || current <= previous || node.dataset.scoreAnimating) return;
      const match = currentText.match(/[০-৯\d][০-৯\d,০-৯]*/);
      if (!match) return;
      const useBn = /[০-৯]/.test(match[0]);
      const start = performance.now(), duration = reducedMotion.matches ? 0 : 360;
      node.dataset.scoreAnimating = "true";
      const step = (now) => {
        const t = duration ? Math.min(1, (now - start) / duration) : 1;
        const value = Math.round(previous + (current - previous) * (1 - Math.pow(1 - t, 3)));
        node.textContent = currentText.replace(match[0], renderDigits(value, useBn));
        if (t < 1) requestAnimationFrame(step); else { delete node.dataset.scoreAnimating; node.dataset.scoreValue = String(current); }
      };
      requestAnimationFrame(step);
    };
    const register = (node) => { if (!watched.has(node)) { watched.add(node); node.dataset.scoreValue = String(digits(node.textContent)); new MutationObserver(() => animate(node)).observe(node, { childList: true, characterData: true, subtree: true }); } };
    const scan = () => document.querySelectorAll("[id$='Score'],.result-score").forEach(register);
    scan();
    ["#playContent", "#shopArcadeGame", "#snakeDialog", "#brickDialog", "#spaceDialog", "#rapidDialog", "#classicArcadeDialog", "#carromDialog", "#tableDialog"]
      .map((selector) => document.querySelector(selector)).filter(Boolean)
      .forEach((root) => new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches("[id$='Score'],.result-score")) register(node);
        node.querySelectorAll?.("[id$='Score'],.result-score").forEach(register);
      }))).observe(root, { childList: true, subtree: true }));
  }

  function installPwa() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js").catch((error) => console.warn("Offline mode is unavailable", error)));
    let installPrompt = null;
    const button = document.createElement("button");
    button.type = "button"; button.id = "installApp"; button.className = "language install-app"; button.hidden = true;
    button.textContent = text("অ্যাপ ইনস্টল", "Install app");
    document.querySelector("#languageBtn")?.insertAdjacentElement("afterend", button);
    window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); installPrompt = event; button.hidden = false; });
    window.addEventListener("appinstalled", () => { button.hidden = true; installPrompt = null; });
    button.addEventListener("click", async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; button.hidden = true; });
    document.addEventListener("agerdin:language", () => { button.textContent = text("অ্যাপ ইনস্টল", "Install app"); });
  }

  function installGamepad() {
    let frame = 0; const held = new Set();
    const connected = () => Boolean(navigator.getGamepads?.().some(Boolean));
    const hint = (dialog, connected) => {
      dialog.querySelector(".gamepad-hint")?.remove();
      dialog.classList.toggle("has-gamepad", connected);
      if (!connected) return;
      const note = document.createElement("p"); note.className = "gamepad-hint"; note.setAttribute("role", "status");
      note.textContent = text("গেমপ্যাড যুক্ত · দিক বোতামে চালান, A চাপুন", "Gamepad ready · D-pad to move, A to act");
      dialog.prepend(note);
    };
    const keyEvent = (type, code) => document.dispatchEvent(new KeyboardEvent(type, { code, key: code === "Space" ? " " : code.replace("Arrow", ""), bubbles: true, cancelable: true }));
    const poll = () => {
      const pad = [...(navigator.getGamepads?.() || [])].find(Boolean);
      const dialog = document.querySelector("dialog[open]");
      const current = new Set();
      if (pad && dialog) {
        if (pad.axes[0] < -.35) current.add("ArrowLeft"); if (pad.axes[0] > .35) current.add("ArrowRight");
        if (pad.axes[1] < -.35) current.add("ArrowUp"); if (pad.axes[1] > .35) current.add("ArrowDown");
        if (pad.buttons[0]?.pressed) current.add("Space");
        current.forEach((code) => { if (!held.has(code)) keyEvent("keydown", code); });
        held.forEach((code) => { if (!current.has(code)) keyEvent("keyup", code); });
        held.clear(); current.forEach((code) => held.add(code));
      } else if (held.size) { held.forEach((code) => keyEvent("keyup", code)); held.clear(); }
      if (dialog && navigator.getGamepads?.().some(Boolean)) frame = requestAnimationFrame(poll); else frame = 0;
    };
    window.addEventListener("gamepadconnected", () => { if (!frame && document.querySelector("dialog[open]")) frame = requestAnimationFrame(poll); document.querySelectorAll("dialog[open]").forEach((dialog) => hint(dialog, true)); });
    window.addEventListener("gamepaddisconnected", () => { cancelAnimationFrame(frame); frame = 0; document.querySelectorAll(".has-gamepad").forEach((dialog) => hint(dialog, false)); });
    document.querySelectorAll("dialog").forEach((dialog) => new MutationObserver(() => { if (dialog.open && connected()) { hint(dialog, true); if (!frame) frame = requestAnimationFrame(poll); } }).observe(dialog, { attributes: true, attributeFilter: ["open"] }));
    document.addEventListener("agerdin:language", () => document.querySelectorAll("dialog.has-gamepad").forEach((dialog) => hint(dialog, true)));
    document.addEventListener("visibilitychange", () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else if (document.querySelector("dialog[open]") && navigator.getGamepads?.().some(Boolean) && !frame) frame = requestAnimationFrame(poll); });
  }

  function installKeyboardHints() {
    document.querySelectorAll("canvas[tabindex],button,a,select").forEach((el) => { if (!el.hasAttribute("aria-keyshortcuts") && el.matches("canvas")) el.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight ArrowUp ArrowDown Space"); });
  }
}
