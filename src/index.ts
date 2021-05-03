import { LogLevel, Store } from '@sapphire/framework';
import { Intents } from 'discord.js';
import { join } from 'node:path';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-i18next/register-discordjs';
import 'reflect-metadata';
import i18next from 'i18next';
import { config } from 'dotenv';

config();


import { StarlightClient } from './lib/Client.js';
import { noop, helpUsagePostProcessor, rootFolder } from './lib/utils/index.js';
import { EnvLoader } from './lib/utils/EnvLoader.js';

Store.injectedContext.env = new EnvLoader();
const client = new StarlightClient({
	ws: {
		intents: Intents.ALL
	},
	logger: {
		level: LogLevel.Trace
	},
	defaultPrefix: 's!',
	caseInsensitiveCommands: true,
	regexPrefix: /^(hey +)?starlight[,! ]/,
	shards: 'auto',
	baseUserDirectory: join(rootFolder, 'dist')
});

const main = async (): Promise<void> => {
	i18next.use(helpUsagePostProcessor);
	try {
		client.logger.info('Logging in');
		await client.login(Store.injectedContext.env.parseString('BOT_TOKEN'));
		client.logger.info('Logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main().catch(noop);
