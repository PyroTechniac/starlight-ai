import esbuild from 'esbuild';
import { opendir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeFileSync } from 'fs';

const PROD_OPTIONS = {
	minify: true,
	sourcesContent: true
}

const DEV_OPTIONS = {
	minify: false,
	sourcesContent: false
}

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

const DIST = join(process.cwd(), 'dist');
const SRC = join(process.cwd(), 'src');

const folder = SRC;
const regexp = /\.(?:t|j)sx?$/;
const cb = (path) => regexp.test(path);

export default async function minify(env) {
	const files = [];
	console.time('scan');
	for await (const path of scan(folder, cb)) {
		if (!path.endsWith('.d.ts')) {
			files.push(path);
		}
	}
	console.timeEnd('scan');
	let buildOptions = {
		entryPoints: files,
		format: 'esm',
		write: true,
		outdir: DIST,
		platform: 'node',
		tsconfig: join(SRC, 'tsconfig.json'),
		sourcemap: true,
		metafile: true,
		splitting: true
	};
	switch (env) {
		case 'production': {
			buildOptions = { ...buildOptions, ...PROD_OPTIONS };
			break;
		}
		case 'development': {
			buildOptions = { ...buildOptions, ...DEV_OPTIONS };
			break;
		}
		default: throw new Error('Unreachable');
	};
	console.time('build');
	const result = await esbuild.build(buildOptions);
	console.timeEnd('build');
	console.time('meta');
	await writeFile(join(DIST, `meta-${env}.json`), JSON.stringify(result.metafile, null, 4));
	console.timeEnd('meta');
}
