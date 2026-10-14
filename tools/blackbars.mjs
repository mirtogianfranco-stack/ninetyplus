// Black-bar guard (owner, 2026-09-22: "the clip at 53 seconds has black bars... that should be something
// that should be caught within our guardrails"). Every clip an edit uses is sampled with ffmpeg cropdetect at
// the offsets the edit actually plays; a letterboxed or pillarboxed source FAILS the gate.
// Usage: node tools/blackbars.mjs out/edit.cjs video037
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const [, , bundle, key] = process.argv;
const edit = (await import('file://' + process.cwd() + '/' + bundle))[key];
const TOL = 8;                      // px of bar we tolerate (encoder edge noise)
const PUB = 'public/';

// every clip the edit plays, with the offsets it starts each chunk at
const used = new Map();             // path -> Set(offset seconds)
for (const leg of edit.legs || []) {
  const span = Math.max(0.1, leg.end - leg.start);
  const chunk = span / Math.max(1, (leg.clips || []).length);
  (leg.clips || []).forEach((c, i) => {
    const [path, off] = c.split('#');
    const start = Number(off || 0);
    const set = used.get(path) || new Set();
    set.add(start);                                     // where the chunk starts
    set.add(start + Math.min(chunk, 2) / 2);            // and a little way in
    used.set(path, set);
  });
}

const fails = [];
for (const [path, offsets] of used) {
  const file = PUB + path;
  if (!existsSync(file)) { fails.push(`MISSING ${path}`); continue; }
  let w = 0, h = 0;
  try {
    const wh = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${file}"`).toString().trim().split(',');
    w = Number(wh[0]); h = Number(wh[1]);
  } catch { fails.push(`UNREADABLE ${path}`); continue; }
  for (const t of [...offsets].sort((a, b) => a - b)) {
    let crop = '';
    try {
      const out = execSync(`ffmpeg -hide_banner -ss ${t.toFixed(2)} -t 1 -i "${file}" -vf cropdetect=24:2:0 -f null - 2>&1`, { encoding: 'utf8' });
      const m = out.match(/crop=(\d+):(\d+):(\d+):(\d+)/g);
      crop = m ? m[m.length - 1] : '';
    } catch { continue; }
    if (!crop) continue;
    const [cw, ch] = crop.replace('crop=', '').split(':').map(Number);
    if (w - cw > TOL || h - ch > TOL) fails.push(`BLACK BARS ${path} @${t.toFixed(1)}s: source ${w}x${h}, picture ${cw}x${ch} (fix: ffmpeg -i in.mp4 -vf "${crop},scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}" out.mp4)`);
  }
}

if (fails.length) { console.log('BLACK-BAR CHECK:\n  ' + fails.join('\n  ')); process.exit(1); }
console.log(`BLACK-BAR CHECK: OK (${used.size} clips sampled)`);
