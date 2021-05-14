import { config } from 'dotenv';
import { EnvLoader } from './utils/EnvLoader.js';
import { Store } from '@sapphire/framework';

config();

process.env.NODE_ENV ??= 'development';
Store.injectedContext.env = new EnvLoader();
