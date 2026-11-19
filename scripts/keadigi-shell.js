(() => {
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

    function showCategory(hash, moveFocus = false) {
      const index = Math.max(0, links.findIndex((link) => link.hash === hash));
      links.forEach((link, position) => {
        sections[position].hidden = position !== index;
        if (position === index) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      content.scrollTop = 0;
      if (moveFocus) {
        const heading = sections[index].querySelector("h2");
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }

    categories.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      showCategory(link.hash, event.detail === 0);
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
  toggle.className = "kea-button kea-rail-icon kea-rail-toggle";
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
