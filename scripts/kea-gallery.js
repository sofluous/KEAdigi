(() => {
  const gallery = document.querySelector(".kea-gallery");
  const modeButtons = [...document.querySelectorAll("[data-gallery-mode]")];
  const sectionLinks = [...document.querySelectorAll(".kea-gallery-nav a")];
  const points = document.querySelector("#galleryPoints");
  const level = document.querySelector("#galleryLevel");
  const topic = document.querySelector("#galleryTopic");
  const overlay = document.querySelector("#galleryDialog");

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
