import type { SapphireClient } from '@sapphire/framework';
import { Time } from '../utils/types.js';
import * as nodeFetch from 'node-fetch';
import type { FetchManager } from './FetchManager';
import AbortController from 'abort-controller';
import { TimerManager } from '@sapphire/time-utilities';
import { FetchError } from './errors/FetchError.js';

export type FetchTypes = 'json' | 'buffer' | 'result' | 'text';

export interface ContentNodeJSON {
	url: string;
	createdAt: number;
	type: FetchTypes;
	options: nodeFetch.RequestInit;
}

export interface ContentNodeContext {
	manager: FetchManager;
	url: string;
}

export class ContentNode {
	public type: FetchTypes = 'json';

	public createdTimestamp: number = Date.now();

	public options: nodeFetch.RequestInit = {};

	public readonly manager: FetchManager;

	public readonly url: string;

	#data: unknown = null; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

	#timeout = Date.now() + Time.Minute * 15; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

	public constructor(context: ContentNodeContext) {
		this.manager = context.manager;
		this.url = context.url;
	}

	public get client(): SapphireClient {
		return this.manager.client;
	}

	public get fetching(): boolean {
		return this.manager.fetchMap.has(this);
	}

	public get createdAt(): Date {
		return new Date(this.createdTimestamp);
	}

	public get expired(): boolean {
		return Date.now() > this.#timeout && !this.fetching;
	}

	public fetch(force = this.#data === null): Promise<ContentNode> {
		const fetchStatus = this.manager.fetchMap.get(this);
		if (!force && fetchStatus) return fetchStatus || Promise.resolve(this);

		const sync = ContentNode.fetch(this)
			.then((data): this => {
				this.#data = data;
				this.#timeout = Date.now() + Time.Minute * 15;
				return this;
			})
			.finally((): void => {
				this.manager.fetchMap.delete(this);
			});

		this.manager.fetchMap.set(this, sync);
		return sync;
	}

	public data<V>(): V | null {
		return (this.#data as V) ?? null;
	}

	public setType(type: FetchTypes = 'json'): this {
		this.type = type;
		return this;
	}

	public setOptions(options: nodeFetch.RequestInit = {}): this {
		this.options = { ...this.options, ...options };
		return this;
	}

	public toString(): string {
		return `ContentNode(${this.url})`;
	}

	public toJSON(): ContentNodeJSON {
		return {
			url: this.url,
			type: this.type,
			createdAt: this.createdTimestamp,
			options: this.options
		};
	}

	private static async fetch(node: ContentNode): Promise<unknown> {
		const { url, options, type } = node;
		const controller = new AbortController();
		const timeout = TimerManager.setTimeout((): void => controller.abort(), 30000);
		const result: nodeFetch.Response = await nodeFetch.default(url, { ...options, signal: controller.signal }).finally((): void => TimerManager.clearTimeout(timeout));
		if (!result.ok) throw new FetchError(url, result.status, await result.clone().text());

		switch (type) {
			case 'json':
				return result.json();
			case 'buffer':
				return result.buffer();
			case 'text':
				return result.text();
			case 'result':
				return result;
			default:
				throw new TypeError(`Invalid fetch type: ${type}`);
		}
	}
}
