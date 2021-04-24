import esbuild from 'esbuild';
import { opendir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeFileSync } from 'fs';

async function* scan(path, cb) {
	const dir = await opendir(path);

	for await (const item of dir) {
		const file = join(dir.path, item.name);
		if (item.isFile()) {
			if (cb(file)) yield file;
		} else if (item.isDirectory()) {
			yield* scan(file, cb);
		}
	}
}

// const folder = new URL('../src', import.meta.url);
const folder = join(process.cwd(), 'src');
const regexp = /\.(?:t|j)sx?$/;
const cb = (path) => regexp.test(path);

const files = [];
console.time('scan');
for await (const path of scan(folder, cb)) {
	if (!path.endsWith('.d.ts')) {
		files.push(path);
	}
}
console.timeEnd('scan');
console.time('build');
const result = await esbuild.build({
	entryPoints: files,
	format: 'esm',
	write: true,
	outdir: join(process.cwd(), 'dist'),
	platform: 'node',
	tsconfig: join(process.cwd(), 'src', 'tsconfig.json'),
	sourcemap: true,
	metafile: true,
	sourcesContent: false
});
console.timeEnd('build');
writeFileSync(join(process.cwd(), 'dist', 'meta.json'), JSON.stringify(result.metafile, null, 4));
