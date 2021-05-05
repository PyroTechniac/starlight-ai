export interface IdentifiablePayload {
	id: number;
}

export type NoId<T> = Omit<T, 'id'>;

export enum IncomingType {
	Void
}

export type IncomingPayload = IncomingVoidPayload;

export interface IncomingVoidPayload extends IdentifiablePayload {
	type: IncomingType.Void;
}

export enum OutgoingType {
	Heartbeat,
	UnknownCommand
}

export type OutgoingPayload = OutgoingHeartbeatPayload | OutgoingUnknownCommandPayload;

export interface OutgoingHeartbeatPayload {
	type: OutgoingType.Heartbeat;
}

export interface OutgoingUnknownCommandPayload extends IdentifiablePayload {
	type: OutgoingType.UnknownCommand;
}
