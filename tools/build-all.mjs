// Runs every build step in the right order. Run:  node tools/build-all.mjs
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
for (const s of ['build-chats', 'build-demos', 'build-journeys', 'build-requirements', 'build-index', 'build-hub']) {
  console.log('\n== ' + s);
  execFileSync(process.execPath, [path.join(dir, s + '.mjs')], { stdio: 'inherit' });
}
