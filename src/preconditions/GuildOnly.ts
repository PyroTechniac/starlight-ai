import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Framework.Precondition {
	public run(message: Message): Framework.PreconditionResult {
		return message.guild === null
			? this.error({ identifier: Framework.Identifiers.PreconditionGuildOnly, message: 'You cannot run this command in DMs.' })
			: this.ok();
	}
}
