import { join } from "node:path";

export const noop = (): null => null;

export const filterArray = <V>(array: V[]): V[] => [...new Set(array)];

export const rootFolder = join(process.cwd());
