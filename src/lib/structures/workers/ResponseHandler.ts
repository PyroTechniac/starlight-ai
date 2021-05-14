import { TimerManager } from '@sapphire/time-utilities';
import { createReferPromise, ReferredPromise } from '../../utils';
import { TimeoutError } from '../../errors';
import type { OutgoingPayload } from './types';

export class ResponseHandler {
	private id = -1;
	private handler: ReferredPromise<OutgoingPayload> | null = null;
	private timer: NodeJS.Timeout | null = null;

	public timeout(delay: number | null): boolean {
		if (delay === null) {
			return this.clearTimeout();
		}

		const { id } = this;
		if (id === -1) {
			return false;
		}

		this.clearTimeout();
		this.timer = TimerManager.setTimeout((): void => this.reject(id, new TimeoutError()), delay);
		return true;
	}

	public define(id: number): Promise<OutgoingPayload> {
		this.id = id;
		this.handler = createReferPromise();

		return this.handler.promise;
	}

	public resolve(id: number, payload: OutgoingPayload): void {
		if (this.id === id) {
			this.id = -1;
			this.clearTimeout();
			this.handler!.resolve(payload);
			this.handler = null;
		}
	}

	public reject(id: number, error: Error): void {
		if (this.id === id) {
			this.id = -1;
			this.clearTimeout();
			this.handler!.reject(error);
			this.handler = null;
		}
	}

	private clearTimeout(): boolean {
		if (this.timer) {
			TimerManager.clearTimeout(this.timer);
			this.timer = null;
			return true;
		}
		return false;
	}
}
