import type { PostProcessorModule } from "i18next";
import { join } from "node:path";

export const noop = (): null => null;

export const filterArray = <V>(array: V[]): V[] => [...new Set(array)];

export const rootFolder = join(process.cwd());

export const helpUsagePostProcessor: PostProcessorModule = {
	type: 'postProcessor',
	name: 'helpUsagePostProcessor',
	process(value, [key]): string {
		return value === key ? '' : value;
	}
}
