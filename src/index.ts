import { LogLevel } from '@sapphire/framework';
import { Intents } from 'discord.js';
import '@sapphire/plugin-logger/register';
import 'reflect-metadata';

import { StarlightClient } from './lib/Client';
import { BOT_TOKEN } from './config';

const client = new StarlightClient({
	intents: Intents.ALL,
	logger: {
		level: LogLevel.Trace
	},
	defaultPrefix: 's!',
	caseInsensitiveCommands: true,
	regexPrefix: /^(hey +)?starlight[,! ]/,
	shards: 'auto'
});

const main = async (): Promise<void> => {
	try {
		client.logger.info('Logging in');
		await client.login(BOT_TOKEN);
		client.logger.info('Logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main(); // eslint-disable-line @typescript-eslint/no-floating-promises
