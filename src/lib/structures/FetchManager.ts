import Collection from '@discordjs/collection';
import type { SapphireClient } from '@sapphire/framework';
import { TimerManager } from '@sapphire/time-utilities';
import { URL } from 'url';
import { ContentNode, ContentNodeJSON } from './ContentNode';

export class FetchManager extends Collection<string, ContentNode> {
	public readonly fetchMap = new WeakMap<ContentNode, Promise<ContentNode>>();

	#sweepInterval: null | NodeJS.Timer = null; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

	public constructor(public readonly client: SapphireClient) {
		super();
	}

	public acquire(url: string): ContentNode {
		return this.get(url) ?? this.create(url);
	}

	public set(url: string, node: ContentNode): this {
		if (this.#sweepInterval === null) this.#sweepInterval = TimerManager.setInterval(this.sweep.bind(this), 30000);
		return super.set(url, node);
	}

	public sweep(fn: (value: ContentNode, key: string, collection: this) => boolean = (cn): boolean => cn.expired, thisArg?: any): number {
		const amount = super.sweep(fn, thisArg);

		if (this.size === 0) {
			TimerManager.clearInterval(this.#sweepInterval!);
			this.#sweepInterval = null;
		}

		return amount;
	}

	public create(url: string): ContentNode {
		try {
			new URL(url);
		} catch {
			throw new Error('Invalid url provided');
		}

		const node = new ContentNode({ manager: this, url });
		this.set(url, node);

		return node;
	}

	public async fetch(force?: boolean): Promise<ContentNode[]> {
		return Promise.all(this.map((node): Promise<ContentNode> => node.fetch(force)));
	}

	public toJSON(): ContentNodeJSON[] {
		return this.map((node): ContentNodeJSON => node.toJSON());
	}

	public static get [Symbol.species](): MapConstructor {
		return (Collection as unknown) as MapConstructor;
	}
}
