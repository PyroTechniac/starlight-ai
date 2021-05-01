import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Framework.Precondition {
	public run(message: Message): Framework.PreconditionResult {
		return Reflect.get(message.channel, 'nsfw') === true
			? this.ok()
			: this.error({ identifier: Framework.Identifiers.PreconditionNSFW, message: 'You cannot run this command outside NSFW channels.' });
	}
}
