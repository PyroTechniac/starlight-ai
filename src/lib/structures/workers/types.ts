export interface IdentifiablePayload {
	id: number;
}

export type NoId<T> = Omit<T, 'id'>;

export enum IncomingType {
	ReadFile
}

export type IncomingPayload = IncomingReadFilePayload;

export interface IncomingReadFilePayload extends IdentifiablePayload {
	type: IncomingType.ReadFile;
	path: string;
}

export enum OutgoingType {
	Heartbeat,
	FileRead,
	UnknownCommand
}

export type OutgoingPayload = OutgoingHeartbeatPayload | OutgoingUnknownCommandPayload | OutgoingFileReadPayload;

export interface OutgoingHeartbeatPayload {
	type: OutgoingType.Heartbeat;
}

export interface OutgoingFileReadPayload extends IdentifiablePayload {
	type: OutgoingType.FileRead;
	data: Uint8Array;
}

export interface OutgoingUnknownCommandPayload extends IdentifiablePayload {
	type: OutgoingType.UnknownCommand;
}
