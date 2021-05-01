import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Framework.Precondition {
	public run(message: Message): Framework.PreconditionResult {
		return message.guild === null
			? this.ok()
			: this.error({ identifier: Framework.Identifiers.PreconditionDMOnly, message: 'You cannot run this command outside DMs.' });
	}
}
