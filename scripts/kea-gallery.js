(() => {
  const gallery = document.querySelector(".kea-gallery");
  const modeButtons = [...document.querySelectorAll("[data-gallery-mode]")];
  const sectionLinks = [...document.querySelectorAll(".kea-gallery-nav a")];
  const points = document.querySelector("#galleryPoints");
  const level = document.querySelector("#galleryLevel");
  const topic = document.querySelector("#galleryTopic");
  const overlay = document.querySelector("#galleryDialog");

  function renderButtonMatrix() {
    const body = document.querySelector("#buttonMatrixBody");
    const states = ["default", "hover", "pressed", "focus", "selected", "disabled", "loading"];
    const variants = [
      { name: "Primary action", use: "Advance or commit", label: "Continue", loading: true },
      { name: "Secondary action", use: "Alternate or cancel", label: "Cancel", variantClass: "kea-button--secondary", loading: true },
      { name: "Ghost action", use: "Low-emphasis utility", label: "Help", variantClass: "kea-button--ghost", loading: true },
      { name: "Icon action", use: "Predictable toolbar command", label: "Reset", variantClass: "kea-button--secondary kea-board-reset", iconOnly: true },
      { name: "Toggle", use: "Turn a mode on or off", label: "Mode", variantClass: "kea-button--secondary kea-toggle", selected: "aria-pressed" },
      { name: "Disclosure", use: "Show or hide a group", label: "Controls", variantClass: "kea-rail-icon kea-rail-toggle kea-disclosure", rail: "kea-topbar", iconOnly: true, selected: "aria-expanded" },
      { name: "Tab", use: "Select one panel in a group", label: "Concepts", variantClass: "kea-rail-icon kea-tab", rail: "kea-library-rail", selected: "aria-selected" },
      { name: "Destructive action", use: "Commit an irreversible change", unavailable: true, loading: true }
    ];
    const preview = new Set(["hover", "pressed", "focus"]);

    for (const variant of variants) {
      const row = body.insertRow();
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = variant.name;
      const use = document.createElement("small");
      use.className = "kea-matrix-purpose";
      use.textContent = variant.use;
      heading.appendChild(use);
      row.appendChild(heading);

      for (const state of states) {
        const cell = row.insertCell();
        const isLink = variant.selected === "aria-selected";
        const notApplicable = (state === "selected" && !variant.selected) ||
          (state === "disabled" && isLink) || (state === "loading" && !variant.loading);
        if (notApplicable || variant.unavailable || state === "loading") {
          cell.textContent = notApplicable ? "N/A" : "Missing";
          cell.className = notApplicable ? "kea-matrix-na" : "kea-matrix-missing";
          continue;
        }

        const label = document.createElement("span");
        label.className = "visually-hidden";
        label.textContent = "Available";
        cell.appendChild(label);
        const sample = document.createElement("div");
        sample.className = "kea-matrix-sample";
        if (variant.rail) sample.classList.add(variant.rail);
        if (isLink) sample.classList.add("kea-category-nav");
        sample.inert = true;

        const button = document.createElement(isLink ? "a" : "button");
        button.className = ["kea-button", variant.variantClass].filter(Boolean).join(" ");
        if (variant.iconOnly) button.setAttribute("aria-label", variant.label);
        else button.textContent = variant.label;
        if (isLink) {
          button.href = "#concept";
          button.setAttribute("role", "tab");
        }
        else button.type = "button";
        if (preview.has(state)) button.dataset.keaPreview = state;
        if (state === "disabled") button.disabled = true;
        if (variant.selected) {
          button.setAttribute(variant.selected, String(state === "selected"));
        }
        sample.appendChild(button);
        cell.appendChild(sample);
      }
    }
  }

  renderButtonMatrix();

  function refreshReadout() {
    const mode = modeButtons.find((button) => button.getAttribute("aria-pressed") === "true");
    gallery.classList.toggle("kea-gallery-large", mode === modeButtons[1]);
    document.querySelector("#galleryLevelValue").textContent = level.value + "%";
    document.querySelector("#galleryStatus").textContent = mode.textContent + " · " + topic.value;
  }

  function selectMode(selected) {
    for (const button of modeButtons) {
      button.setAttribute("aria-pressed", String(button === selected));
      button.classList.toggle("active", button === selected);
    }
    refreshReadout();
  }

  function updateCurrentSection() {
    const current = sectionLinks.find((link) => link.hash === location.hash) || sectionLinks[0];
    for (const link of sectionLinks) {
      if (link === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  window.addEventListener("hashchange", updateCurrentSection);
  updateCurrentSection();
  for (const button of modeButtons) button.addEventListener("click", () => selectMode(button));
  level.addEventListener("input", refreshReadout);
  topic.addEventListener("change", refreshReadout);
  document.querySelector("#galleryIncrement").addEventListener("click", () => {
    points.textContent = String(Number(points.textContent) + 1);
  });
  document.querySelector("#galleryReset").addEventListener("click", () => {
    points.textContent = "0";
    level.value = "50";
    topic.selectedIndex = 0;
    selectMode(modeButtons[0]);
  });
  for (const opener of document.querySelectorAll("[data-gallery-help]")) {
    opener.addEventListener("click", () => { overlay.hidden = false; });
  }
  document.querySelector("#galleryClose").addEventListener("click", () => { overlay.hidden = true; });
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) overlay.hidden = true;
  });
})();
