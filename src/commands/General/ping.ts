import { ApplyOptions } from '@sapphire/decorators';
import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';
import * as DJSUtils from '@sapphire/discord.js-utilities';

@ApplyOptions<Framework.CommandOptions>({
	description: 'ping pong',
	enabled: true
})
export default class extends Framework.Command {
	public async run(message: Message): Promise<Message> {
		const msg = await message.channel.send('Ping?');
		const handler = new DJSUtils.MessagePrompter('Are you sure you want to continue?', DJSUtils.MessagePrompterStrategies.Confirm, { explicitReturn: true });

		const result = (await handler.run(message.channel, message.author)) as DJSUtils.IMessagePrompterExplicitConfirmReturn;

		await result.appliedMessage.delete();
		return result.confirmed
			? msg.edit(
					`Pong! Bot Latency ${Math.round(this.context.client.ws.ping)}ms. API Latency ${
						msg.createdTimestamp - message.createdTimestamp
					}ms.`
			  )
			: msg.delete();
	}
}
