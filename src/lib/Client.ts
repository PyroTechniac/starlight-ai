import * as Framework from '@sapphire/framework';
import { FetchManager } from './structures/FetchManager.js';
import type { ClientOptions } from 'discord.js';
import { WorkerManager } from './structures/workers/WorkerManager.js';
import { EnvLoader } from './utils/EnvLoader.js';
import type { PieceContextExtras } from '@sapphire/pieces';

export class StarlightClient extends Framework.SapphireClient {
	public fetch: FetchManager = new FetchManager(this);

	public constructor(options: ClientOptions) {
		super(options);

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
		readonly context: PieceContextExtras;
	}
}

declare module '@sapphire/pieces' {
	interface PieceContextExtras {
		workers: WorkerManager;
		env: EnvLoader;
	}
}
