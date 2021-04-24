import { SapphireClient } from '@sapphire/framework';
import { FetchManager } from './structures/FetchManager.js';

export class StarlightClient extends SapphireClient {
	public fetch: FetchManager = new FetchManager(this);
}

declare module 'discord.js' {
	interface Client {
		fetch: FetchManager;
	}
}
