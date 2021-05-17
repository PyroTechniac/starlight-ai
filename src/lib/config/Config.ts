import { GuildEntity } from "../database/entities/GuildEntity";
import { toss } from "../utils";

export class Config {
	#values = new Map<Config.ConfigKeys, string>();

	public get(key: Config.ConfigKeys): string {
		return this.#values.get(key) ?? toss(new Error(`Invalid config key '${key}'`));
	}

	public set(key: Config.ConfigKeys, value: string): this {
		this.#values.set(key, value);
		return this;
	}

	public *values(): IterableIterator<string> {
		yield* this.#values.values();
	}

	public *keys(): IterableIterator<Config.ConfigKeys> {
		yield* this.#values.keys();
	}

	public *[Symbol.iterator](): IterableIterator<[Config.ConfigKeys, string]> {
		yield* this.#values;
	}

	public static from(entity: GuildEntity): Config {
		const config = new Config();
		config.set(Config.ConfigKeys.ID, entity.id);
		config.set(Config.ConfigKeys.Language, entity.language);
		config.set(Config.ConfigKeys.Prefix, entity.prefix);
		return config;
	}
}

export namespace Config {
	// export type ConfigKeys = 'id' | 'language' | 'prefix';
	export const enum ConfigKeys {
		ID = 'id',
		Language = 'language',
		Prefix = 'prefix'
	}
}
