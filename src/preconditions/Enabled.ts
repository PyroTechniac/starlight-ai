import { ApplyOptions } from '@sapphire/decorators';
import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Framework.PreconditionOptions>({
	position: 10
})
export default class extends Framework.Precondition {
	public run(_: Message, command: Framework.Command, context: Framework.PreconditionContext): Framework.PreconditionResult {
		return command.enabled
			? this.ok()
			: this.error({ identifier: Framework.Identifiers.CommandDisabled, message: 'This command is disabled.', context });
	}
}
