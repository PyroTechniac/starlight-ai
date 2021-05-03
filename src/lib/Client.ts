import * as Framework from '@sapphire/framework';
import { join } from 'node:path';
import { AssetStore } from './structures/AssetStore.js';
import { FetchManager } from './structures/FetchManager.js';
import type { ClientOptions } from 'discord.js';
import { WorkerManager } from './structures/workers/WorkerManager.js';
import { EnvLoader } from './utils/EnvLoader.js';
import type { PieceContextExtras } from '@sapphire/pieces';
import { rootFolder } from './utils/index.js';

export class StarlightClient extends Framework.SapphireClient {
	public fetch: FetchManager = new FetchManager(this);

	public constructor(options: ClientOptions) {
		super(options);

		this.stores.register(new AssetStore().registerPath(join(rootFolder, 'dist', 'assets')));

		this.context.workers = new WorkerManager();
	}

	public get context(): PieceContextExtras {
		return Framework.Store.injectedContext;
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

declare module '@sapphire/pieces' {
	interface PieceContextExtras {
		workers: WorkerManager;
		env: EnvLoader
	}
}
