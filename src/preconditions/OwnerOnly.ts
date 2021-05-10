import { AsyncPreconditionResult, Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Precondition {
	private get owners(): string[] {
		return this.context.client.context.env.parseArray('OWNERS');
	}

	public async run(message: Message): AsyncPreconditionResult {
		return this.owners.includes(message.author.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
