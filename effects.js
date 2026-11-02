// Fun animations: the 🎲 roulette and the heart burst.
// Everything is skipped for people who asked their phone for less motion ("Reduce motion").

export function prefersCalm() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Slot machine: names flash fast, slow down, and stop on the winner.
// overlay = the dark full-screen box, nameEl = where the name is written.
export async function spinRoulette(overlay, nameEl, names, winner) {
  overlay.hidden = false;
  overlay.classList.remove("roulette--win");
  const steps = 18;
  for (let i = 0; i < steps; i++) {
    nameEl.textContent = names[i % names.length];
    // Restart the small "tick" animation for every new name
    nameEl.classList.remove("tick");
    void nameEl.offsetWidth;
    nameEl.classList.add("tick");
    // Fast at the start, slower at the end (like a real wheel)
    await wait(45 + (i / steps) ** 2.2 * 260);
  }
  nameEl.textContent = winner;
  overlay.classList.add("roulette--win");
  await wait(900);
  overlay.hidden = true;
}

// Little hearts fly out of a point on the screen (x, y in pixels)
export function heartBurst(x, y) {
  const hearts = ["💖", "💗", "💕", "❤️", "💞", "💓"];
  hearts.forEach((heart, i) => {
    const el = document.createElement("span");
    el.className = "heart-fly";
    el.textContent = heart;
    const angle = (i / hearts.length) * Math.PI * 2 - Math.PI / 2;
    const distance = 40 + Math.random() * 30;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * distance - 20}px`);
    document.body.append(el);
    el.addEventListener("animationend", () => el.remove());
  });
}
