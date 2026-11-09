import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';

const result = await build({
  entryPoints: ['src/client.jsx'],
  bundle: true,
  format: 'cjs',
  external: ['react'],
  loader: { '.css': 'text' },
  write: false,
});
await mkdir('lib', { recursive: true });
await writeFile('lib/client.js', `window.__ModuleLoader__.load({
  id: "dsh-chinese-skin",
  factory: (require) => {
    const module = { exports: {} };
    ${result.outputFiles[0].text}
    return module.exports;
  }
});\n`);
