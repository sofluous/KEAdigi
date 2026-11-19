(() => {
  const shell = document.querySelector(".kea-pilot");
  const toggle = shell.querySelector("#classViewButton");
  const preference = new URL(location.href).searchParams.get("view");

  function applyClassView(enabled) {
    shell.classList.toggle("kea-class-view", enabled);
    toggle.setAttribute("aria-pressed", String(enabled));
    window.dispatchEvent(new Event("resize"));
  }

  applyClassView(preference === "class");
  toggle.addEventListener("click", () => {
    const enabled = toggle.getAttribute("aria-pressed") !== "true";
    const url = new URL(location.href);
    if (enabled) url.searchParams.set("view", "class");
    else url.searchParams.delete("view");
    if (location.protocol !== "file:") history.replaceState(null, "", url);
    applyClassView(enabled);
  });
})();
