import { readFile } from '@pyrotechniac/star-utils';
import { rootFolder, toss } from '../utils';
import { Config } from './Config';

export class ConfigParser {
	public readonly raw: Buffer;
	public constructor(raw: Buffer) {
		this.raw = Buffer.from(raw);
		this.validate();
	}

	public parse(): Config {
		const dataWithoutHeader = this.raw.slice(ConfigParser.header.length).toString();
		const config = new Config();
		// Split by newline, and filter out empty spaces
		const parsed = dataWithoutHeader.split('\n').filter((value): boolean => value !== '');
		for (const line of parsed) {
			const [equalsIndex, firstQuoteIndex, lastQuoteIndex] = this.parseLine(line);
			const key = line.slice(1, equalsIndex);
			const value = line.slice(firstQuoteIndex + 1, lastQuoteIndex);
			config.set(ConfigParser.snakeToCamel(key) as Config.ConfigKeys, value);
		}

		return config;
	}

	private validate(): void {
		if (!this.raw.slice(0, ConfigParser.header.length).equals(ConfigParser.header)) throw new Error('Invalid Header');
	}

	private parseLine(input: string): readonly [number, number, number] {
		this.validateLine(input);
		const firstQuoteIndex = input.indexOf("'");
		const lastQuoteIndex = input.lastIndexOf("'");
		const equalsIndex = input.indexOf('=');
		this.validateLine(firstQuoteIndex, lastQuoteIndex, equalsIndex);
		return [equalsIndex, firstQuoteIndex, lastQuoteIndex] as const;

	}

	private validateLine(value: string): void;
	private validateLine(firstQuoteIndex: number, lastQuoteIndex: number, equalsIndex: number): void;
	private validateLine(unknownFirst: string | number, lastQuoteIndex?: number, equalsIndex?: number): void {
		if (typeof unknownFirst === 'string') {
			const value = unknownFirst;
			if (!value.startsWith('+')) throw new Error('Line begins with invalid character');
			if (!value.endsWith(';')) throw new Error('Line ends with invalid character');
			return;
		} else {
			const firstQuoteIndex = unknownFirst;
			if (firstQuoteIndex === -1 || lastQuoteIndex === -1) throw new Error('Expected two single quotes around input');
			if (firstQuoteIndex === lastQuoteIndex) throw new Error('Expected two single quotes around input');
			if (equalsIndex === -1) throw new Error('Expected equals sign between key and input');
			return;
		}
	}

	private static baseFile = rootFolder('assets', 'base-config.star');

	private static header = Buffer.from('# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY\n# starlight config file v1\n');

	static #base: Buffer | null = null;

	public static get base(): Buffer {
		return this.#base ?? toss(new Error('ConfigParser not initialized'));
	}

	private static set base(value: Buffer) {
		this.#base = value;
	}

	public static async init() {
		this.base = await readFile(this.baseFile);
		new ConfigParser(this.base);
	}

	public static configToBuffer(config: Config): Buffer {
		let base = Buffer.from(this.header).toString().concat('\n');
		console.log(base);
		const values = [...config];
		for (const [key, value] of values) {
			const stringToAdd = `+${key}='${value}';\n\n`;
			base = base.concat(stringToAdd);
		}
		base = base.trimEnd().concat('\n');
		return Buffer.from(base);
	}

	private static snakeToCamel(input: string): string {
		return input.replace(/([-_][a-z])/g,
			(group): string => group.toUpperCase()
				.replace('-', '')
				.replace('_', ''))
	}
}
