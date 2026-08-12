// Generates the brand-styled example chart SVGs in this directory.
// Layouts come from d3 (math only, no DOM); the SVG is plain templating.
// Regenerate:  npm install --no-save d3-hierarchy d3-sankey d3-delaunay d3-shape
//              node make-examples.mjs
import { writeFileSync } from "node:fs";
import { hierarchy, treemap, pack, partition } from "d3-hierarchy";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import { Delaunay } from "d3-delaunay";
import { arc } from "d3-shape";

// Brand-derived chart palette. The categorical trio passes the six palette
// checks (CVD ΔE, chroma floor, lightness band) on a white surface; the amber
// needs direct labels, which every example carries. Sequential = teal ramp.
const CAT = ["#0093A1", "#E0A32E", "#E35B6A"]; // chart-teal, amber, brand accent
const SEQ = ["#d5e8e9", "#a5cdd0", "#6fa9ae", "#3d8a90", "#1C6D72"]; // light→dark teal
const INK = "#2a2a2a", INK2 = "#666666", SURFACE = "#ffffff";
const FONT = `font-family="Helvetica Neue, Helvetica, Arial, sans-serif"`;

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ${FONT}>\n${body}\n</svg>\n`;
// Lightness tints of a hex color toward white (t=0 → color, t=1 → white)
const tint = (hex, t) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const m = c => Math.round(c + (255 - c) * t).toString(16).padStart(2, "0");
  return `#${m(r)}${m(g)}${m(b)}`;
};
// Deterministic LCG so re-runs are identical
const rng = (seed => () => (seed = (seed * 48271) % 2147483647) / 2147483647)(42);

// ── Treemap — hierarchical part-to-whole, node-hours by domain ────────────────
{
  const data = {
    children: [
      { name: "Chemistry", children: [
        { name: "DFT", value: 320 }, { name: "MD", value: 210 },
        { name: "QM/MM", value: 90 }, { name: "Docking", value: 60 }] },
      { name: "ML / AI", children: [
        { name: "Training", value: 260 }, { name: "Inference", value: 110 },
        { name: "Fine-tune", value: 80 }] },
      { name: "Engineering", children: [
        { name: "CFD", value: 170 }, { name: "FEA", value: 100 },
        { name: "Other", value: 50 }] },
    ],
  };
  const root = hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
  treemap().size([900, 470]).paddingInner(2).paddingTop(24).paddingLeft(2)
    .paddingRight(2).paddingBottom(2)(root);
  let b = "";
  root.children.forEach((g, gi) => {
    b += `<text x="${g.x0 + 6}" y="${g.y0 + 16}" font-size="14" font-weight="600" fill="${INK}">${esc(g.data.name)}</text>\n`;
    g.children.forEach((n, ni) => {
      const w = n.x1 - n.x0, h = n.y1 - n.y0;
      b += `<rect x="${n.x0}" y="${n.y0}" width="${w}" height="${h}" rx="4" fill="${tint(CAT[gi], 0.12 + ni * 0.16)}"/>\n`;
      if (w > 68 && h > 40) {
        const dark = ni < 2; // light text only on the darker tints
        b += `<text x="${n.x0 + 8}" y="${n.y0 + 20}" font-size="13" fill="${dark ? SURFACE : INK}">${esc(n.data.name)}</text>\n`;
        b += `<text x="${n.x0 + 8}" y="${n.y0 + 38}" font-size="12" fill="${dark ? SURFACE : INK2}">${n.value}k</text>\n`;
      }
    });
  });
  writeFileSync("treemap.svg", svgDoc(900, 470, b));
}

// ── Sunburst — the same hierarchy as rings ────────────────────────────────────
{
  const data = {
    children: [
      { name: "Chemistry", children: [
        { name: "DFT", value: 320 }, { name: "MD", value: 210 }, { name: "QM/MM", value: 150 }] },
      { name: "ML / AI", children: [
        { name: "Training", value: 260 }, { name: "Inference", value: 190 }] },
      { name: "Engineering", children: [
        { name: "CFD", value: 170 }, { name: "FEA", value: 150 }] },
    ],
  };
  const R = 225;
  const root = hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
  partition().size([2 * Math.PI, 2])(root); // depth → [0,2]; we draw depth 1 and 2
  const ring = arc().startAngle(d => d.x0).endAngle(d => d.x1)
    .innerRadius(d => d.depth === 1 ? R * 0.38 : R * 0.70)
    .outerRadius(d => d.depth === 1 ? R * 0.68 : R * 0.98)
    .padAngle(0.008).padRadius(R);
  let b = `<g transform="translate(${R},${R})">\n`;
  root.descendants().filter(d => d.depth > 0).forEach(d => {
    const gi = (d.depth === 1 ? d : d.parent).parent.children.indexOf(d.depth === 1 ? d : d.parent);
    const fill = d.depth === 1 ? CAT[gi] : tint(CAT[gi], 0.35 + d.parent.children.indexOf(d) * 0.18);
    b += `<path d="${ring(d)}" fill="${fill}" stroke="${SURFACE}" stroke-width="2"/>\n`;
    const mid = (d.x0 + d.x1) / 2, r = d.depth === 1 ? R * 0.53 : R * 0.84;
    if ((d.x1 - d.x0) > 0.35) {
      const x = Math.sin(mid) * r, y = -Math.cos(mid) * r;
      b += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="13" text-anchor="middle" dominant-baseline="middle" fill="${d.depth === 1 ? SURFACE : INK}">${esc(d.data.name)}</text>\n`;
    }
  });
  b += `<text y="-6" font-size="26" font-weight="700" text-anchor="middle" fill="${INK}">1.45M</text>\n`;
  b += `<text y="18" font-size="13" text-anchor="middle" fill="${INK2}">node-hours</text>\n</g>`;
  writeFileSync("sunburst.svg", svgDoc(2 * R, 2 * R, b));
}

// ── Packed bubbles — magnitude at a glance, module load counts ────────────────
{
  const mods = [
    ["gcc", 940, 0], ["python", 880, 1], ["cuda", 610, 1], ["openmpi", 540, 0],
    ["R", 380, 1], ["matlab", 300, 2], ["gaussian", 290, 0], ["vasp", 260, 0],
    ["pytorch", 250, 1], ["gromacs", 200, 0], ["fftw", 150, 0], ["julia", 120, 1],
    ["comsol", 110, 2], ["ansys", 100, 2], ["orca", 90, 0], ["qe", 80, 0],
  ];
  const root = hierarchy({ children: mods.map(([name, v, g]) => ({ name, value: v, g })) })
    .sum(d => d.value).sort((a, b) => b.value - a.value);
  pack().size([620, 470]).padding(4)(root);
  let b = "";
  root.leaves().forEach(n => {
    b += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${tint(CAT[n.data.g], 0.15)}" stroke="${SURFACE}" stroke-width="2"/>\n`;
    if (n.r > 30) {
      b += `<text x="${n.x.toFixed(1)}" y="${(n.y - 2).toFixed(1)}" font-size="${Math.min(16, n.r / 2.6).toFixed(0)}" text-anchor="middle" fill="${SURFACE}" font-weight="600">${esc(n.data.name)}</text>\n`;
      b += `<text x="${n.x.toFixed(1)}" y="${(n.y + 15).toFixed(1)}" font-size="12" text-anchor="middle" fill="${SURFACE}">${n.value}</text>\n`;
    }
  });
  // legend: colored chip + text token, identity never color-alone
  const leg = [["Science apps", 0], ["Languages / ML", 1], ["Commercial", 2]];
  leg.forEach(([t, i], k) => {
    b += `<circle cx="652" cy="${30 + k * 26}" r="7" fill="${tint(CAT[i], 0.15)}"/>\n`;
    b += `<text x="666" y="${35 + k * 26}" font-size="13" fill="${INK}">${t}</text>\n`;
  });
  writeFileSync("bubbles.svg", svgDoc(790, 470, b));
}

// ── Sankey — flow with one emphasized path ────────────────────────────────────
{
  const names = ["Chemistry", "ML / AI", "Engineering", "CPU partition", "GPU partition", "Completed", "Requeued"];
  const nodes = names.map(name => ({ name }));
  const links = [
    { source: 0, target: 3, value: 420 }, { source: 0, target: 4, value: 90 },
    { source: 1, target: 3, value: 80 },  { source: 1, target: 4, value: 310 },
    { source: 2, target: 3, value: 240 }, { source: 2, target: 4, value: 40 },
    { source: 3, target: 5, value: 690 }, { source: 3, target: 6, value: 50 },
    { source: 4, target: 5, value: 400 }, { source: 4, target: 6, value: 40 },
  ];
  const g = sankey().nodeWidth(14).nodePadding(22).extent([[0, 8], [860, 462]])({ nodes, links });
  const path = sankeyLinkHorizontal();
  let b = "";
  g.links.forEach(l => {
    // emphasis: the ML→GPU story link in accent, everything else recessive gray
    const hot = l.source.name === "ML / AI" && l.target.name === "GPU partition";
    b += `<path d="${path(l)}" fill="none" stroke="${hot ? CAT[2] : "#c9ced1"}" stroke-opacity="${hot ? 0.75 : 0.55}" stroke-width="${Math.max(1, l.width)}"/>\n`;
  });
  g.nodes.forEach(n => {
    b += `<rect x="${n.x0}" y="${n.y0}" width="${n.x1 - n.x0}" height="${n.y1 - n.y0}" rx="3" fill="#1C6D72"/>\n`;
    const left = n.x0 < 430;
    b += `<text x="${left ? n.x1 + 8 : n.x0 - 8}" y="${(n.y0 + n.y1) / 2 - 2}" font-size="14" ${left ? "" : 'text-anchor="end"'} fill="${INK}" font-weight="600">${esc(n.name)}</text>\n`;
    b += `<text x="${left ? n.x1 + 8 : n.x0 - 8}" y="${(n.y0 + n.y1) / 2 + 15}" font-size="12" ${left ? "" : 'text-anchor="end"'} fill="${INK2}">${n.value} jobs</text>\n`;
  });
  writeFileSync("sankey.svg", svgDoc(920, 470, b));
}

// ── Voronoi — a continuous value over a sampled 2-D space ─────────────────────
{
  const W = 700, H = 470, N = 26;
  const pts = Array.from({ length: N }, () => [rng() * W, rng() * H]);
  // fake smooth "error" field: distance from a sweet spot, banded onto the ramp
  const val = ([x, y]) => Math.hypot(x - W * 0.62, y - H * 0.4) / Math.hypot(W * 0.62, H * 0.6);
  const vor = Delaunay.from(pts).voronoi([0, 0, W, H]);
  let b = "";
  pts.forEach((p, i) => {
    const poly = vor.cellPolygon(i);
    if (!poly) return;
    const band = SEQ[Math.min(SEQ.length - 1, Math.floor((1 - val(p)) * SEQ.length))];
    b += `<path d="M${poly.map(q => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join("L")}Z" fill="${band}" stroke="${SURFACE}" stroke-width="2"/>\n`;
    b += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="${INK}" fill-opacity="0.55"/>\n`;
  });
  // scale legend for the ramp (sequential must ship with one)
  SEQ.forEach((c, i) => b += `<rect x="${W + 18}" y="${140 + (SEQ.length - 1 - i) * 26}" width="18" height="26" fill="${c}"/>\n`);
  b += `<text x="${W + 44}" y="${152}" font-size="12" fill="${INK2}">high</text>\n`;
  b += `<text x="${W + 44}" y="${140 + SEQ.length * 26 - 6}" font-size="12" fill="${INK2}">low</text>\n`;
  b += `<text x="${W + 18}" y="${126}" font-size="13" fill="${INK}" font-weight="600">yield</text>\n`;
  writeFileSync("voronoi.svg", svgDoc(W + 90, H, b));
}

console.log("wrote treemap.svg sunburst.svg bubbles.svg sankey.svg voronoi.svg");
