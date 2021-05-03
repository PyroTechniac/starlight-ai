import { ApplyOptions } from '@sapphire/decorators';
import * as Framework from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Framework.CommandOptions>({
	description: 'ping pong',
	enabled: true
})
export default class extends Framework.Command {
	public async run(message: Message): Promise<Message> {
		const msg = await message.channel.send('Ping?');
		return msg.edit(
			`Pong! Bot Latency ${Math.round(this.context.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`
		);
	}
}
