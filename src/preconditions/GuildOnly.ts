import { Identifiers, Precondition, PreconditionResult } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Precondition {
	public run(message: Message): PreconditionResult {
		return message.guild === null
			? this.error({ identifier: Identifiers.PreconditionGuildOnly, message: 'You cannot run this command in DMs.' })
			: this.ok();
	}
}
