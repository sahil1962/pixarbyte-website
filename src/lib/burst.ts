/** The design's celebratory pixel burst, used when an estimate is sent. */
export function pixelBurst(from: Element, into: Element) {
  const r = from.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2563eb";
  const palette = [accent, "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4"];
  for (let i = 0; i < 26; i++) {
    const b = document.createElement("i");
    b.className = "bpx";
    b.style.left = `${cx - 4}px`;
    b.style.top = `${cy - 4}px`;
    b.style.background = palette[i % palette.length];
    into.appendChild(b);
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 110;
    const anim = b.animate(
      [
        { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
        {
          transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist + 40}px) rotate(${Math.random() * 360}deg) scale(.6)`,
          opacity: 0,
        },
      ],
      { duration: 800 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" },
    );
    anim.onfinish = () => b.remove();
  }
}
