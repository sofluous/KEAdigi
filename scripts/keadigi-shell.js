(() => {
  document.addEventListener("dragstart", (event) => {
    if (!event.target.closest('[draggable="true"]')) event.preventDefault();
  });

  document.addEventListener("contextmenu", (event) => {
    if (!event.target.closest("input, textarea, select, [contenteditable], [data-selectable]")) {
      event.preventDefault();
    }
  });

  const categories = document.querySelector(".kea-library-rail .kea-category-nav");
  if (categories) {
    const content = document.querySelector(".kea-library-content");
    const links = [...categories.querySelectorAll("a")];
    const sections = links.map((link) => document.getElementById(link.hash.slice(1)));
    const horizontal = matchMedia("(max-width: 720px)");

    categories.setAttribute("role", "tablist");
    function updateOrientation() {
      categories.setAttribute("aria-orientation", horizontal.matches ? "horizontal" : "vertical");
    }
    horizontal.addEventListener("change", updateOrientation);
    updateOrientation();
    links.forEach((link, index) => {
      link.id = `category-tab-${sections[index].id}`;
      link.setAttribute("role", "tab");
      link.setAttribute("aria-controls", sections[index].id);
      sections[index].setAttribute("role", "tabpanel");
      sections[index].setAttribute("aria-labelledby", link.id);
      sections[index].tabIndex = 0;
    });

    function showCategory(hash) {
      const index = Math.max(0, links.findIndex((link) => link.hash === hash));
      links.forEach((link, position) => {
        const selected = position === index;
        sections[position].hidden = !selected;
        link.setAttribute("aria-selected", String(selected));
        link.tabIndex = selected ? 0 : -1;
      });
      content.scrollTop = 0;
    }

    categories.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      showCategory(link.hash);
    });
    categories.addEventListener("keydown", (event) => {
      const index = links.indexOf(event.target);
      if (index < 0 || event.altKey || event.ctrlKey || event.metaKey) return;
      const previous = horizontal.matches ? "ArrowLeft" : "ArrowUp";
      const next = horizontal.matches ? "ArrowRight" : "ArrowDown";
      let target;
      if (event.key === previous) target = (index - 1 + links.length) % links.length;
      else if (event.key === next) target = (index + 1) % links.length;
      else if (event.key === "Home") target = 0;
      else if (event.key === "End") target = links.length - 1;
      else if (event.key === " ") {
        event.preventDefault();
        links[index].click();
        return;
      } else return;
      event.preventDefault();
      const link = links[target];
      if (location.hash !== link.hash) history.replaceState(null, "", link.hash);
      showCategory(link.hash);
      link.focus();
    });
    window.addEventListener("hashchange", () => showCategory(location.hash));
    showCategory(location.hash);
    return;
  }

  const rail = document.querySelector(".kea-module-page .kea-topbar");
  const actions = rail.querySelector(".kea-topbar__actions");
  const toggle = document.createElement("button");
  actions.id ||= "module-controls";
  toggle.type = "button";
  toggle.className = "kea-button kea-rail-icon kea-rail-toggle kea-disclosure";
  toggle.setAttribute("aria-label", "Controls");
  toggle.setAttribute("aria-controls", actions.id);
  const back = rail.querySelector('a[href="index.html"]');
  back.classList.add("kea-rail-icon", "kea-rail-library");
  back.setAttribute("aria-label", "Library");
  back.title = "Library";
  back.textContent = "";
  back.after(toggle);

  function setExpanded(expanded) {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.title = expanded ? "Hide controls" : "Show controls";
    actions.hidden = !expanded;
    rail.classList.toggle("kea-rail-collapsed", !expanded);
    window.dispatchEvent(new Event("resize"));
  }

  toggle.addEventListener("click", () => setExpanded(actions.hidden));
  setExpanded(false);
})();
