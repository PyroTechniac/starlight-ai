import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Framework.Precondition {
	private get owners():string[]{
		return Framework.Store.injectedContext.env.parseArray('OWNERS')
	}

	public async run(message: Message): Framework.AsyncPreconditionResult {
		return this.owners.includes(message.author.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
