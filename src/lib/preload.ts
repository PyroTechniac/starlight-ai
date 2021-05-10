import { config } from 'dotenv';
import { EnvLoader } from './utils/EnvLoader.js';
import { Store } from '@sapphire/framework';

config();

Store.injectedContext.env = new EnvLoader();
