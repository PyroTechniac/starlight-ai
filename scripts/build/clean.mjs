import { rm } from 'node:fs/promises';

const distFolder = new URL('../../dist', import.meta.url);

const cwdFolder = new URL('../../cwd', import.meta.url);

await Promise.all([cwdFolder, distFolder].map((folder) => rm(folder, { recursive: true, force: true })));
