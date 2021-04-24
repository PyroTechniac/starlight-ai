import { ApplyOptions } from '@sapphire/decorators';
import * as Framework from '@sapphire/framework';

@ApplyOptions<Framework.EventOptions>({
	once: true,
	name: 'ready'
})
export default class extends Framework.Event {
	public run(): void {
		this.context.client.id ??= this.context.client.user?.id ?? null;
	}
}
