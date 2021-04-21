import { ApplyOptions } from '@sapphire/decorators';
import { Event, EventOptions } from '@sapphire/framework';

@ApplyOptions<EventOptions>({
	once: true,
	name: 'ready'
})
export default class extends Event {
	public run(): void {
		this.context.client.id ??= this.context.client.user?.id ?? null;
	}
}
