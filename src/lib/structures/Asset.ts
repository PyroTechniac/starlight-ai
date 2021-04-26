import * as Pieces from '@sapphire/pieces';
import { MessageAttachment } from 'discord.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { noop, rootFolder } from '../utils/index.js';
import type { File, Resolvable } from '../utils/types.js';

export interface AssetOptions extends Pieces.PieceOptions {
	filename?: string;
	filepath?: string;
}

export abstract class Asset extends Pieces.Piece implements Resolvable<MessageAttachment>{
	public filename: string;

	public filepath: string;

	/* eslint-disable @typescript-eslint/explicit-member-accessibility */
	#raw: null | Buffer = null;

	#initialized: boolean = false;
	/* eslint-enable @typescript-eslint/explicit-member-accessibility */

	public constructor(context: Pieces.PieceContext, options: AssetOptions = {}) {
		super(context, options);

		this.filename = options.filename ?? '';
		this.filepath = options.filepath ?? '';
	}

	public get attachment(): File {
		if (this.#raw === null) {
			throw new Error(this.#initialized ? 'Failed to load asset.' : 'Asset has not been loaded.');
		}

		return {
			name: this.filename,
			file: this.#raw
		}
	}

	public resolve(): MessageAttachment {
		const { attachment } = this;
		return new MessageAttachment(attachment.file, attachment.name);
	}

	public async onLoad(): Promise<void> {
		this.#initialized = true;
		this.#raw = await readFile(this.filepath).catch(noop);
	}

	public toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			filepath: this.filepath,
			filename: this.filename,
			file: this.#raw
		}
	}

	public static get basePath(): string {
		return this.makePath();
	}

	public static makePath(...paths: readonly string[]): string {
		return join(rootFolder, 'assets', ...paths);
	}
}
