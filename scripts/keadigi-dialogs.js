(() => {
  const shell = document.querySelector(".kea-shell");
  const overlays = [...document.querySelectorAll(".kea-help-overlay")];
  const focusable = "button, input, select, textarea, a[href], [tabindex]";
  let active = null;
  let opener = null;

  function syncDialog() {
    const visible = overlays.find((overlay) => !overlay.hidden) || null;
    if (visible === active) return;

    if (!visible) {
      active = null;
      shell.inert = false;
      opener?.focus();
      opener = null;
      return;
    }

    if (!active) opener = document.activeElement;
    active = visible;
    const dialog = active.querySelector(".kea-help-dialog");
    dialog.tabIndex = -1;
    shell.inert = true;
    const initialFocus = dialog.querySelector("input:not([disabled])") || dialog;
    initialFocus.focus();
  }

  const observer = new MutationObserver(syncDialog);
  for (const overlay of overlays) {
    observer.observe(overlay, { attributes: true, attributeFilter: ["hidden"] });
  }

  document.addEventListener("keydown", (event) => {
    if (!active) return;

    // Module shortcuts belong to the background while a dialog is open.
    event.stopImmediatePropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      active.hidden = true;
    } else if (event.key === "Tab") {
      const stops = [...active.querySelectorAll(focusable)].filter(
        (element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length
      );
      const index = stops.indexOf(document.activeElement);
      const boundary = event.shiftKey ? index <= 0 : index < 0 || index === stops.length - 1;
      if (boundary) {
        event.preventDefault();
        const next = event.shiftKey ? stops.at(-1) : stops[0];
        next?.focus();
      }
    }
  }, true);
  syncDialog();
})();
