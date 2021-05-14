import { Nullish, isNullish } from '@sapphire/utilities';
import { EnvError } from '../errors';
import { toss } from './index';

export class EnvLoader {
	public parseInteger(key: EnvLoader.EnvInteger, defaultValue?: number): number {
		const value = process.env[key];
		if (this.isNullishOrEmpty(value)) {
			return defaultValue ?? toss(new EnvError(key, 'The key must be an integer, but is empty or undefined.'));
		}

		const integer = Number(value);
		return Number.isInteger(integer) ? integer : toss(new EnvError(key, `The key must be an integer, but received '${value}'.`));
	}

	public parseBoolean(key: EnvLoader.EnvBoolean, defaultValue?: boolean): boolean {
		const value = process.env[key];
		if (this.isNullishOrEmpty(value)) {
			return defaultValue ?? toss(new EnvError(key, 'The key must be a boolean, but is empty or undefined.'));
		}

		if (value === 'true') return true;
		if (value === 'false') return false;
		throw new EnvError(key, `The key must be a booleam, but received '${value}'.`);
	}

	public parseString<K extends EnvLoader.EnvString>(key: K, defaultValue?: string): string {
		const value = process.env[key];
		if (this.isNullishOrEmpty(value)) {
			return defaultValue ?? toss(new EnvError(key, 'The key must be a string, but is empty or undefined.'));
		}

		return value;
	}

	public parseArray(key: EnvLoader.EnvString, defaultValue?: string[]): string[] {
		const value = process.env[key];
		if (this.isNullishOrEmpty(value)) {
			return defaultValue ?? toss(new EnvError(key, 'The key must be an array, but is empty or undefined'));
		}

		return value.split(' ');
	}

	public isDefined(...keys: EnvLoader.EnvAny[]): boolean {
		return keys.every((key): boolean => {
			const value = process.env[key];
			return typeof value !== 'undefined' && value.length !== 0;
		});
	}

	private isNullishOrEmpty(value: unknown): value is Nullish | '' {
		return value === '' || isNullish(value);
	}
}

export namespace EnvLoader {
	export type BooleanString = 'true' | 'false';
	export type IntegerString = `${bigint}`;

	export type EnvAny = keyof EnvKeys;
	export type EnvString = { [K in EnvAny]: EnvKeys[K] extends BooleanString | IntegerString ? never : K }[EnvAny];
	export type EnvBoolean = { [K in EnvAny]: EnvKeys[K] extends BooleanString ? K : never }[EnvAny];
	export type EnvInteger = { [K in EnvAny]: EnvKeys[K] extends IntegerString ? K : never }[EnvAny];

	export interface EnvKeys {
		NODE_ENV: 'development' | 'production';
		BOT_TOKEN: string;
		OWNERS: string;
		PREFIX: string;
		WORKER_COUNT: IntegerString;
		TYPEORM_DEBUG_LOGS: BooleanString;
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvLoader.EnvKeys {}
	}
}
