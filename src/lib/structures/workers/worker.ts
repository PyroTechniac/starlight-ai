import { TimerManager } from '@sapphire/time-utilities';
import * as WorkerThreads from 'node:worker_threads';
import * as WorkerTypes from './types.js';

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

parentPort!.on('message', (message: WorkerTypes.IncomingPayload): void => post(handleMessage(message)));

function handleMessage(message: WorkerTypes.IncomingPayload): WorkerTypes.OutgoingPayload {
	switch (message) {
		default:
			return { id: message.id, type: OutgoingType.UnknownCommand };
	}
}
