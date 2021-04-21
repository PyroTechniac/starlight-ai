import esbuild from 'esbuild';
import { opendir } from 'node:fs/promises';
import { join } from 'node:path';
import { URL } from 'node:url';


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

const folder = new URL('./src', import.meta.url);
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
await esbuild.build({
	entryPoints: files,
	format: 'cjs',
	write: true,
	outdir: join(process.cwd(), '..', 'dist'),
	platform: 'node',
	tsconfig: join(process.cwd(), '..', 'src', 'tsconfig.json'),
	sourcemap: true,
	minifyIdentifiers: true,
	minifySyntax: true
});
console.timeEnd('build');
