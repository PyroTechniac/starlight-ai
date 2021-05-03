import { TimerManager } from '@sapphire/time-utilities';
import * as WorkerThreads from 'node:worker_threads';
import * as WorkerTypes from './types.js';
import { readFile } from 'node:fs/promises';

const { isMainThread, parentPort } = WorkerThreads;
const { OutgoingType } = WorkerTypes;

function checkParentPort(port: unknown): asserts port is WorkerThreads.MessagePort {
	if (isMainThread || port === null) throw new Error('The Worker may only be ran via the worker_threads fork method!');
}

function post(message: WorkerTypes.OutgoingPayload): void {
	return parentPort!.postMessage(message);
}

checkParentPort(parentPort);

TimerManager.setInterval((): void => post({ type: OutgoingType.Heartbeat }), 30000);

parentPort!.on('message', async (message: WorkerTypes.IncomingPayload): Promise<void> => post(await handleMessage(message)));

async function handleMessage(message: WorkerTypes.IncomingPayload): Promise<WorkerTypes.OutgoingPayload> {
	switch (message.type) {
		case WorkerTypes.IncomingType.ReadFile: {
			return handleReadFile(message);
		}
		default:
			return { id: message.id, type: OutgoingType.UnknownCommand };
	}
}

async function handleReadFile(message: WorkerTypes.IncomingReadFilePayload): Promise<WorkerTypes.OutgoingFileReadPayload> {
	const file = await readFile(message.path);
	return { id: message.id, type: WorkerTypes.OutgoingType.FileRead, data: file };
}
