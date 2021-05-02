export class TimeoutError extends Error {
	public constructor() {
		super('Timeout reached.');
	}
}
