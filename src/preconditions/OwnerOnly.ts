import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Framework.Precondition {
	public async run(message: Message): Framework.AsyncPreconditionResult {
		return Framework.Store.injectedContext.env.parseArray('OWNERS').includes(message.author.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
