import { SapphireClient, Store } from '@sapphire/framework';
import { FetchManager } from './structures/FetchManager';
import type { ClientOptions } from 'discord.js';
import { WorkerManager } from './structures/workers/WorkerManager';
import { EnvLoader } from './utils';
import type { PieceContextExtras } from '@sapphire/pieces';
import type { DbManager } from './database/util/DbManager';

export class StarlightClient extends SapphireClient {
	// @ts-ignore override doesn't work on props
	public fetch: FetchManager = new FetchManager(this);

	// @ts-ignore override doesn't work on props
	public dev = process.env.NODE_ENV !== 'production';

	public constructor(options: ClientOptions) {
		super(options);

		this.context.workers = new WorkerManager();
	}

	public override get context(): PieceContextExtras {
		return Store.injectedContext;
	}

	// @ts-ignore override doesn't work on props
	public fetchLanguage = (): string => 'en-US';
}

declare module 'discord.js' {
	interface Client {
		fetch: FetchManager;
		dev: boolean;
		readonly context: PieceContextExtras;
	}
}

declare module '@sapphire/pieces' {
	interface PieceContextExtras {
		workers: WorkerManager;
		env: EnvLoader;
		db: DbManager;
	}
}
