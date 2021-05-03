import { cpus } from 'node:os';
import type { IncomingPayload, IncomingReadFilePayload, NoId, OutgoingFileReadPayload, OutgoingPayload } from './types.js';
import { WorkerHandler } from './WorkerHandler.js';
import { Store } from '@sapphire/framework';

export class WorkerManager {
	public readonly workers: WorkerHandler[] = [];

	public constructor(amount = Store.injectedContext.env.parseInteger('WORKER_COUNT', cpus().length)) {
		for (let i = 0; i < amount; i++) {
			this.workers.push(new WorkerHandler());
		}
	}

	private get idealWorker(): WorkerHandler {
		return this.workers.reduce((best, worker): WorkerHandler => (best.remaining > worker.remaining ? worker : best));
	}

	public async start(): Promise<void> {
		await Promise.all(this.workers.map((worker): Promise<void> => worker.start()));
	}

	public async destroy(): Promise<void> {
		await Promise.all(this.workers.map((worker): Promise<void> => worker.destroy()));
	}

	public async send(data: NoId<IncomingReadFilePayload>, delay?: number | null): Promise<OutgoingFileReadPayload>;
	public async send(data: NoId<IncomingPayload>, delay?: number | null): Promise<OutgoingPayload> {
		return this.idealWorker.send(data, delay);
	}
}
