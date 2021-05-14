import type { EnvLoader } from 'lib/utils';

export class EnvError extends Error {
	public constructor(public readonly key: EnvLoader.EnvAny, addendum: string) {
		super(`[ENV] ${key} - ${addendum}`);
	}
}
