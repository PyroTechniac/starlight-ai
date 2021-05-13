import { LogLevel, Store } from '@sapphire/framework';
import { Intents } from 'discord.js';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-i18next/register-discordjs';
import 'reflect-metadata';
import '@skyra/editable-commands';
import i18next from 'i18next';

import './lib/preload';
import { StarlightClient } from './lib/Client';
import { noop, helpUsagePostProcessor } from './lib/utils';
import { DbManager } from './lib/database/util/DbManager';

const client = new StarlightClient({
	intents: Intents.ALL,
	logger: {
		level: LogLevel.Trace
	},
	defaultPrefix: Store.injectedContext.env.parseString('PREFIX', 's!'),
	caseInsensitiveCommands: true,
	regexPrefix: /^(hey +)?starlight[,! ]/,
	shards: 'auto',
	baseUserDirectory: __dirname
});

const main = async (): Promise<void> => {
	i18next.use(helpUsagePostProcessor);
	try {
		throw new Error('test');
		Store.injectedContext.db = await DbManager.connect();
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
