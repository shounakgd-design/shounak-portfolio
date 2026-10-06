const PAL = [
  ["#6366f1", "#a5b4fc", "#ec4899"],
  ["#f97316", "#fde68a", "#f43f5e"],
  ["#14b8a6", "#a7f3d0", "#3b82f6"],
  ["#8b5cf6", "#f0abfc", "#06b6d4"],
  ["#0ea5e9", "#bae6fd", "#22c55e"],
  ["#f43f5e", "#fecdd3", "#f59e0b"],
];

function rng(seed) {
  let a = seed | 0;
  return function () {
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function art(seed, ui = false) {
  const r = rng(seed);
  const p = PAL[Math.floor(r() * PAL.length)];

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p[0]}"/>
        <stop offset="1" stop-color="${p[1]}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)"/>`;

  for (let i = 0; i < 4; i++) {
    s += `<circle cx="${r() * 400 | 0}" cy="${r() * 300 | 0}" r="${40 + r() * 90 | 0}" fill="#fff" opacity="${(0.1 + r() * 0.2).toFixed(2)}"/>`;
  }

  s += `<path d="M0 ${200 + r() * 60 | 0} C100 ${150 + r() * 80 | 0},250 ${250 + r() * 50 | 0},400 ${180 + r() * 70 | 0}V300H0Z" fill="${p[2]}" opacity=".4"/>`;

  if (ui) {
    s += `<rect x="70" y="55" width="260" height="190" rx="18" fill="#fff" opacity=".92"/>
      <circle cx="92" cy="77" r="5" fill="${p[2]}"/>
      <circle cx="108" cy="77" r="5" fill="${p[0]}"/>
      <rect x="92" y="105" width="150" height="12" rx="6" fill="${p[0]}" opacity=".8"/>
      <rect x="92" y="130" width="216" height="8" rx="4" fill="#d8d8e2"/>
      <rect x="92" y="148" width="180" height="8" rx="4" fill="#d8d8e2"/>
      <rect x="92" y="190" width="70" height="28" rx="14" fill="${p[2]}"/>`;
  }

  return "data:image/svg+xml," + encodeURIComponent(s + "</svg>");
}

export function avatarArt() {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#c7d2fe"/>
        <stop offset="1" stop-color="#fbcfe8"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#a)"/>
    <path d="M14 100c0-26 16-38 36-38s36 12 36 38z" fill="#5b5bf0"/>
    <circle cx="50" cy="40" r="19" fill="#f5c9a8"/>
    <path d="M30 38c0-16 10-23 21-23s20 7 19 23c-4-8-10-11-20-11s-15 3-20 11z" fill="#2a2433"/>
  </svg>`;

  return "data:image/svg+xml," + encodeURIComponent(s);
}
