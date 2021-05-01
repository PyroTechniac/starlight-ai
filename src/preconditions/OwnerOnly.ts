import * as Framework from '@sapphire/framework';
import { OWNERS } from '../config.js';
import type { Message } from 'discord.js';

export default class extends Framework.Precondition {
	public async run(message: Message): Framework.AsyncPreconditionResult {
		return OWNERS.includes(message.author.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
