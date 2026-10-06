/*
  js/charts/brandLibrary.js
  Brand / Library orchestrator.

  Registers the module key expected by chartManagertwo.js:
    window.signalChartModules["brand/Library"]

  Wires center-column accordions:
  - Click left chevron OR header toggles open
  - Only one center accordion stays open at a time
  - Open panel body has a max height with internal scrolling
*/

(function () {
  const PANEL_KEY = "brand/Library";

  window.signalChartModules = window.signalChartModules || {};
  // Don't clobber an existing implementation.
  if (typeof window.signalChartModules[PANEL_KEY] === "function") return;

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  function qsa(root, sel) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function ensureAccordionScrolling(groupEl) {
    // If your markup already uses a scroll wrapper, we honor it.
    const body = qs(groupEl, ".lib-group-body") || qs(groupEl, ".lib-body") || qs(groupEl, ".lib-group__body");
    if (!body) return;

    // Look for a table wrapper (preferred). If not present, apply to body.
    const wrapper = qs(body, ".lib-table-wrap") || body;
    wrapper.style.maxHeight = wrapper.style.maxHeight || "360px";
    wrapper.style.overflowY = "auto";
  }

  function closeAllExcept(containerEl, keepEl) {
    qsa(containerEl, ".lib-group").forEach((group) => {
      if (group === keepEl) return;
      group.classList.remove("is-open");
      const body = qs(group, ".lib-group-body") || qs(group, ".lib-body") || qs(group, ".lib-group__body");
      if (body) body.hidden = true;

      const chevron = qs(group, ".lib-toggle") || qs(group, ".acc-toggle") || qs(group, ".accordion-toggle");
      if (chevron) chevron.setAttribute("aria-expanded", "false");
    });
  }

  function openGroup(group) {
    group.classList.add("is-open");
    const body = qs(group, ".lib-group-body") || qs(group, ".lib-body") || qs(group, ".lib-group__body");
    if (body) body.hidden = false;

    const chevron = qs(group, ".lib-toggle") || qs(group, ".acc-toggle") || qs(group, ".accordion-toggle");
    if (chevron) chevron.setAttribute("aria-expanded", "true");

    ensureAccordionScrolling(group);
  }

  function toggleGroup(containerEl, group) {
    const isOpen = group.classList.contains("is-open");
    if (isOpen) {
      group.classList.remove("is-open");
      const body = qs(group, ".lib-group-body") || qs(group, ".lib-body") || qs(group, ".lib-group__body");
      if (body) body.hidden = true;
      return;
    }

    closeAllExcept(containerEl, group);
    openGroup(group);
  }

  function wireAccordions(rootEl) {
    // Center column should contain multiple .lib-group blocks.
    const containerEl = qs(rootEl, ".brand-library-middle") || qs(rootEl, ".brand-library-center") || rootEl;

    const groups = qsa(containerEl, ".lib-group");
    if (!groups.length) return;

    groups.forEach((group) => {
      const head = qs(group, ".lib-group-head") || qs(group, ".lib-head") || qs(group, ".lib-group__head");
      const body = qs(group, ".lib-group-body") || qs(group, ".lib-body") || qs(group, ".lib-group__body");

      // Default closed state.
      if (body) body.hidden = !group.classList.contains("is-open");

      // Make sure there's a left toggle target for the arrow.
      const toggle = qs(group, ".lib-toggle") || qs(group, ".acc-toggle") || qs(group, ".accordion-toggle");
      if (toggle) {
        toggle.style.cursor = "pointer";
        toggle.setAttribute("role", "button");
        toggle.setAttribute("tabindex", "0");
        toggle.setAttribute("aria-expanded", group.classList.contains("is-open") ? "true" : "false");
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleGroup(containerEl, group);
        });
        toggle.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleGroup(containerEl, group);
          }
        });
      }

      if (head) {
        head.style.cursor = "pointer";
        head.addEventListener("click", (e) => {
          // Avoid double-trigger when clicking the toggle.
          if (toggle && (e.target === toggle || toggle.contains(e.target))) return;
          toggleGroup(containerEl, group);
        });
      }
    });

    // If any group is initially open, enforce single-open rule.
    const initiallyOpen = groups.find((g) => g.classList.contains("is-open"));
    if (initiallyOpen) {
      closeAllExcept(containerEl, initiallyOpen);
      openGroup(initiallyOpen);
    }
  }

  async function tryInitSparklines() {
    // These are optional; only run if present.
    const fns = [
      window.signalOS_brandLibrarySparkTikTok,
      window.signalOS_brandLibrarySparkYouTube,
      window.signalOS_brandLibrarySparkLinkedIn,
      window.signalOS_brandLibrarySparkWebCopy
    ].filter((fn) => typeof fn === "function");

    for (const fn of fns) {
      try { fn(); } catch (e) { /* ignore */ }
    }
  }

  window.signalChartModules[PANEL_KEY] = async function initBrandLibrary() {
    // We assume app.js has already injected the panel HTML.
    // This module is responsible for interactive wiring.
    const root = document.getElementById("panel-left") || document.querySelector(".panel-left") || document.body;
    wireAccordions(root);
    await tryInitSparklines();
  };
})();
