// YouTube chapter list for a preview video: node tools/preview-chapters.mjs 022  -> paste into the description.
// YouTube needs the first chapter at 0:00, at least 3 chapters, each >= 10s.
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const n = process.argv[2];
const v = /^\d/.test(n) ? 'np' + n : n;
execSync(`npx esbuild src/previews/${v}.ts --bundle --platform=node --format=cjs --outfile=out/preview.cjs --loader:.json=json --log-level=error`);
const { spec } = createRequire(import.meta.url)(path.resolve('out/preview.cjs'));
const t = (i) => spec.words.words[i].start;
const S = [{ label: 'Intro', start: 0 }, ...spec.chapters.map((c) => ({ label: c.label, start: t(c.from) })), { label: 'The full card', start: t(spec.recap.from) }, { label: 'Outro', start: t(spec.outro.from) }];
const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
S.forEach((x, i) => { const len = (S[i + 1]?.start ?? spec.words.duration) - x.start; console.log(mmss(x.start) + ' ' + x.label + (len < 10 ? '   <- under 10s, YouTube will drop the chapters' : '')); });
