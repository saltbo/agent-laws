#!/usr/bin/env node
// Generate the installable skills/ tree from the canonical law source.
//
// The law is authored ONCE under CONSTITUTION.md, laws/, protocol/, and
// AMENDMENTS.md. This script packages it into self-contained skills (each a
// directory the `skills` CLI can install on its own), copying the files each
// skill needs and rewriting cross-references so links resolve both in this repo
// and after installation under .claude/skills/<name>/.
//
// Usage: `npm run build` (or `node scripts/build-skills.mjs`).

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(readFileSync(join(ROOT, 'build', 'skills.json'), 'utf8'));

// Map every canonical source path to where it lands: { skill, dest }.
const placed = new Map();
for (const s of cfg.skills)
  for (const b of s.bundle) placed.set(posix.normalize(b.src), { skill: s.name, dest: b.dest });

const LINK = /\]\(([^)\s]+)\)/g;
let warnings = 0;

// Rewrite markdown links in a bundled file so they point at the bundled copies.
function rewriteLinks(content, srcPath, skillName, destFile) {
  const srcDir = posix.dirname(srcPath);
  const fromDir = posix.dirname(posix.join('skills', skillName, destFile));
  return content.replace(LINK, (whole, target) => {
    if (/^https?:\/\//.test(target) || target.startsWith('#')) return whole;
    const hash = target.indexOf('#');
    const pathPart = hash === -1 ? target : target.slice(0, hash);
    const anchor = hash === -1 ? '' : target.slice(hash);
    if (!pathPart) return whole;
    const resolved = posix.normalize(posix.join(srcDir, pathPart));
    const hit = placed.get(resolved);
    if (!hit) {
      if (pathPart.endsWith('.md')) {
        console.warn(`  ! ${srcPath}: link to unbundled "${pathPart}" left unchanged`);
        warnings++;
      }
      return whole;
    }
    const rel = posix.relative(fromDir, posix.join('skills', hit.skill, hit.dest));
    return `](${rel}${anchor})`;
  });
}

const OUT = join(ROOT, 'skills');
rmSync(OUT, { recursive: true, force: true });

for (const s of cfg.skills) {
  const dir = join(OUT, s.name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'SKILL.md'), readFileSync(join(ROOT, s.template), 'utf8'));
  for (const b of s.bundle) {
    const src = posix.normalize(b.src);
    const banner = `<!-- GENERATED from ${src} by scripts/build-skills.mjs — edit the source, then run \`npm run build\`. -->\n\n`;
    const body = rewriteLinks(readFileSync(join(ROOT, b.src), 'utf8'), src, s.name, b.dest);
    writeFileSync(join(dir, b.dest), banner + body);
  }
  console.log(`  ✓ ${s.name}: SKILL.md + ${s.bundle.length} files`);
}

console.log(warnings ? `done with ${warnings} warning(s).` : 'done, no warnings.');
