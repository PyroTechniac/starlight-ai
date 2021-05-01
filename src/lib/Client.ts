import * as Framework from '@sapphire/framework';
import { join } from 'node:path';
import { AssetStore } from './structures/AssetStore.js';
import { FetchManager } from './structures/FetchManager.js';
import type { ClientOptions } from 'discord.js';

export class StarlightClient extends Framework.SapphireClient {
	public fetch: FetchManager = new FetchManager(this);

	public constructor(options: ClientOptions) {
		super(options);

		this.stores.register(new AssetStore().registerPath(join(process.cwd(), 'dist', 'assets')));
	}

	public fetchLanguage = (): string => 'en-US';
}

declare module 'discord.js' {
	interface Client {
		fetch: FetchManager;
	}
}

declare module '@sapphire/framework' {
	interface StoreRegistryEntries {
		assets: AssetStore;
	}
}
