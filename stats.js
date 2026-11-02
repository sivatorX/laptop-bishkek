// Visitor counter: counts page visits and important clicks (events) in GoatCounter.
// It is off while GOATCOUNTER_CODE in config.js is empty, and never counts on localhost.
import { GOATCOUNTER_CODE } from "./config.js?v=202611021118";

const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);

export function startStats() {
  if (!GOATCOUNTER_CODE || isLocal) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.append(script);
}

// Count a click, e.g. track("open-map"). Shows up in GoatCounter as an event.
export function track(name) {
  if (!GOATCOUNTER_CODE || isLocal) return;
  window.goatcounter?.count?.({ path: name, title: name, event: true });
}
