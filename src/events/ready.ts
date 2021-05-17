import { ApplyOptions } from '@sapphire/decorators';
import { Event, Events, EventOptions, Store } from '@sapphire/framework';
import { gray, red, magenta } from 'colorette';

@ApplyOptions<EventOptions>({
	once: true,
	event: Events.Ready
})
export default class extends Event {
	private style = this.context.client.dev ? magenta : red;
	public run(): void {
		this.context.client.id ??= this.context.client.user?.id ?? null;
		this.printStoreDebugInformation();
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.context;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
