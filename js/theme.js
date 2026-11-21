/* Apply the saved theme (or the device setting) before the page paints.
   Loaded without "defer" in <head> so there is no light/dark flash. */
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var t = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
