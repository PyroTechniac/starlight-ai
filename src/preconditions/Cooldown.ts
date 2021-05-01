import * as Framework from '@sapphire/framework';
import { Bucket } from '@sapphire/ratelimits';
import type { Message } from 'discord.js';

export interface CooldownContext extends Framework.PreconditionContext {
	bucketType?: Framework.BucketType;
	delay?: number;
	limit?: number;
}

export default class extends Framework.Precondition {
	public buckets = new WeakMap<Framework.Command, Bucket<string>>();

	public run(message: Message, command: Framework.Command, context: CooldownContext): Framework.PreconditionResult {
		if (context.external) return this.ok();

		if (!context.delay) return this.ok();

		const bucket = this.getBucket(command, context);

		const remaining = bucket.take(this.getID(message, context));

		return remaining === 0
			? this.ok()
			: this.error({
					identifier: Framework.Identifiers.PreconditionCooldown,
					message: `You have just used this command. Try again in ${Math.ceil(remaining / 1000)} second${remaining > 1000 ? 's' : ''}.`,
					context: { remaining }
			  });
	}

	private getID(message: Message, context: CooldownContext): string {
		switch (context.bucketType) {
			case Framework.BucketType.Global:
				return 'global';
			case Framework.BucketType.Channel:
				return message.channel.id;
			case Framework.BucketType.Guild:
				return message.guild!.id;
			default:
				return message.author.id;
		}
	}

	private getBucket(command: Framework.Command, context: CooldownContext): Bucket<string> {
		let bucket = this.buckets.get(command);
		if (!bucket) {
			bucket = new Bucket();
			if ((context.limit ?? 1) <= 1) bucket.setDelay(context.delay!);
			else bucket.setLimit({ timespan: context.delay!, maximum: context.limit! });
			this.buckets.set(command, bucket);
		}
		return bucket;
	}
}
