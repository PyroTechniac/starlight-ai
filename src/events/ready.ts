import { ApplyOptions } from '@sapphire/decorators';
import { Event, Events, EventOptions } from '@sapphire/framework';

@ApplyOptions<EventOptions>({
	once: true,
	event: Events.Ready
})
export default class extends Event {
	public run(): void {
		this.context.client.id ??= this.context.client.user?.id ?? null;
	}
}
