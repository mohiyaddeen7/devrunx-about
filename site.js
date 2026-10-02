(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const close = () => {
    document.documentElement.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    document.documentElement.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
})();


(() => {
  const mount = document.querySelector("[data-early-access-embed]");
  const state = document.querySelector("[data-form-state]");
  const fallback = document.getElementById("early-access-fallback");
  if (!mount || !state || !fallback) return;

  const rawUrl = window.DEVRUNX_PUBLIC_CONFIG?.tallyFormUrl?.trim() || "";
  let tallyUrl = null;

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === "https:" && parsed.hostname === "tally.so" && parsed.pathname.startsWith("/r/")) {
      tallyUrl = parsed;
    }
  } catch {
    tallyUrl = null;
  }

  if (!tallyUrl) {
    state.textContent = "The early-access form is not connected yet.";
    return;
  }

  fallback.href = tallyUrl.toString();
  fallback.hidden = false;

  const iframeUrl = new URL(tallyUrl.toString());
  iframeUrl.searchParams.set("transparentBackground", "1");
  iframeUrl.searchParams.set("hideTitle", "1");

  const iframe = document.createElement("iframe");
  iframe.src = iframeUrl.toString();
  iframe.title = "DevRunX early access form";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allow", "clipboard-write");
  iframe.className = "tally-frame";

  const pending = mount.querySelector("[data-form-pending]");
  if (pending) pending.remove();
  mount.append(iframe);
  mount.append(fallback);
})();
