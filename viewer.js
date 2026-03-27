(() => {
  const MODAL_ID = "img-modal";
  const IMG_ID = "img-modal-img";

  function createModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "img-modal-backdrop";
    backdrop.id = MODAL_ID;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");

    const content = document.createElement("div");
    content.className = "img-modal-content";

    const closeBtn = document.createElement("button");
    closeBtn.className = "img-modal-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Закрыть");
    closeBtn.textContent = "\u00D7";

    const img = document.createElement("img");
    img.id = IMG_ID;
    img.alt = "";

    content.appendChild(closeBtn);
    content.appendChild(img);
    backdrop.appendChild(content);
    document.body.appendChild(backdrop);

    closeBtn.addEventListener("click", () => closeModal());
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  function openModal(src, alt) {
    let backdrop = document.getElementById(MODAL_ID);
    if (!backdrop) createModal();
    backdrop = document.getElementById(MODAL_ID);

    const img = document.getElementById(IMG_ID);
    img.src = src;
    img.alt = alt || "";

    document.body.style.overflow = "hidden";
    backdrop.classList.add("is-open");
  }

  function closeModal() {
    const backdrop = document.getElementById(MODAL_ID);
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const img = e.target && e.target.closest ? e.target.closest("img") : null;
    if (!img) return;

    const figure = img.closest && (img.closest(".lesson-figure") || img.closest(".final-render-figure"));
    if (!figure) return;

    const hrefAnchor = img.closest("a");
    if (hrefAnchor) e.preventDefault();

    openModal(img.currentSrc || img.src, img.alt);
  });
})();

(() => {
  const TIP_ATTR = "data-tooltip";
  const TIP_ID = "tip-bubble";

  let bubble = null;
  let activeEl = null;
  let hideTimer = null;

  function getBubble() {
    if (bubble) return bubble;
    bubble = document.createElement("div");
    bubble.id = TIP_ID;
    bubble.className = "tip-bubble";
    bubble.setAttribute("role", "tooltip");
    bubble.setAttribute("aria-hidden", "true");
    document.body.appendChild(bubble);
    return bubble;
  }

  function positionBubble(el) {
    const b = getBubble();
    const rect = el.getBoundingClientRect();

    // Сначала сбрасываем координаты, чтобы корректно посчитать размеры.
    b.style.left = "0px";
    b.style.top = "0px";

    const bx = b.offsetWidth || 200;
    const by = b.offsetHeight || 60;

    const centerX = rect.left + rect.width / 2;
    let left = centerX - bx / 2;
    left = Math.max(12, Math.min(window.innerWidth - bx - 12, left));

    let top = rect.bottom + 10;
    if (top + by > window.innerHeight) top = rect.top - by - 10;

    b.style.left = `${left}px`;
    b.style.top = `${top}px`;
  }

  function showTip(el) {
    const text = el && el.getAttribute ? el.getAttribute(TIP_ATTR) : null;
    if (!text) return;
    const b = getBubble();
    b.textContent = text;
    activeEl = el;
    b.classList.add("is-visible");
    b.setAttribute("aria-hidden", "false");
    positionBubble(el);
  }

  function hideTip() {
    if (!bubble) return;
    bubble.classList.remove("is-visible");
    bubble.setAttribute("aria-hidden", "true");
    activeEl = null;
  }

  function closestTipTarget(target) {
    return target && target.closest ? target.closest(`[${TIP_ATTR}]`) : null;
  }

  document.addEventListener("mouseover", (e) => {
    const el = closestTipTarget(e.target);
    if (!el) return;
    clearTimeout(hideTimer);
    showTip(el);
  });

  document.addEventListener("mouseout", (e) => {
    const el = closestTipTarget(e.target);
    if (!el) return;
    hideTimer = window.setTimeout(() => hideTip(), 120);
  });

  document.addEventListener("focusin", (e) => {
    const el = closestTipTarget(e.target);
    if (!el) return;
    clearTimeout(hideTimer);
    showTip(el);
  });

  document.addEventListener("focusout", (e) => {
    const el = closestTipTarget(e.target);
    if (!el) return;
    hideTip();
  });

  // Для мобильных/тач: клик переключает подсказку.
  document.addEventListener("click", (e) => {
    const el = closestTipTarget(e.target);
    if (!el) return;

    // Если это ссылка и нужно “кликнуть в слово”, даём подсказке появиться чуть-чуть,
    // и только потом переходим.
    if (el.tagName === "A" && el.dataset && el.dataset.delayNav === "true") {
      const href = el.getAttribute("href");
      if (href) {
        e.preventDefault();
        showTip(el);
        window.setTimeout(() => {
          window.location.href = href;
        }, 260);
        return;
      }
    }

    if (activeEl === el) hideTip();
    else showTip(el);
  });

  window.addEventListener("scroll", () => hideTip());
  window.addEventListener("resize", () => hideTip());
})();

(() => {
  const CONTAINER_CLASS = "flow-bars";
  const BAR_CLASS = "flow-bar";

  function createFlowBars() {
    if (document.querySelector(`.${CONTAINER_CLASS}`)) return;

    const container = document.createElement("div");
    container.className = CONTAINER_CLASS;
    container.setAttribute("aria-hidden", "true");

    const barsCount = 18;
    for (let i = 0; i < barsCount; i += 1) {
      const bar = document.createElement("span");
      bar.className = BAR_CLASS;

      const top = 6 + Math.random() * 88;
      const width = 150 + Math.random() * 560;
      const height = 10 + Math.random() * 42;
      const duration = 12 + Math.random() * 16;
      const delay = -Math.random() * duration;
      const rotation = -12 + Math.random() * 24;
      const drift = -26 + Math.random() * 52;
      const opacity = 0.28 + Math.random() * 0.34;

      bar.style.setProperty("--top", `${top}%`);
      bar.style.setProperty("--w", `${width}px`);
      bar.style.setProperty("--h", `${height}px`);
      bar.style.setProperty("--dur", `${duration}s`);
      bar.style.setProperty("--delay", `${delay}s`);
      bar.style.setProperty("--rot", `${rotation}deg`);
      bar.style.setProperty("--driftY", `${drift}px`);
      bar.style.setProperty("--opacity", `${opacity.toFixed(2)}`);

      container.appendChild(bar);
    }

    document.body.prepend(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFlowBars);
  } else {
    createFlowBars();
  }
})();

(() => {
  const CONTAINER_CLASS = "flow-bars";
  const BAR_CLASS = "flow-bar";

  function createFlowBars() {
    if (document.querySelector(`.${CONTAINER_CLASS}`)) return;

    const container = document.createElement("div");
    container.className = CONTAINER_CLASS;
    container.setAttribute("aria-hidden", "true");

    const barsCount = 18;
    for (let i = 0; i < barsCount; i += 1) {
      const bar = document.createElement("span");
      bar.className = BAR_CLASS;

      const top = 6 + Math.random() * 88;
      const width = 150 + Math.random() * 560;
      const height = 10 + Math.random() * 42;
      const duration = 12 + Math.random() * 16;
      const delay = -Math.random() * duration;
      const rotation = -12 + Math.random() * 24;
      const drift = -26 + Math.random() * 52;
      const opacity = 0.28 + Math.random() * 0.34;

      bar.style.setProperty("--top", `${top}%`);
      bar.style.setProperty("--w", `${width}px`);
      bar.style.setProperty("--h", `${height}px`);
      bar.style.setProperty("--dur", `${duration}s`);
      bar.style.setProperty("--delay", `${delay}s`);
      bar.style.setProperty("--rot", `${rotation}deg`);
      bar.style.setProperty("--driftY", `${drift}px`);
      bar.style.setProperty("--opacity", `${opacity.toFixed(2)}`);

      container.appendChild(bar);
    }

    document.body.prepend(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFlowBars);
  } else {
    createFlowBars();
  }
})();

