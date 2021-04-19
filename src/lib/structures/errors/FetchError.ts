export class FetchError extends Error {
	#json: unknown = null; // eslint-disable-line @typescript-eslint/explicit-member-accessibility

	public constructor(public readonly url: string, public readonly code: number, public readonly response: string) {
		super(`Failed to fetch '${url}' with code ${code}`);
	}

	public toJSON(): unknown {
		return this.#json ?? (this.#json = JSON.parse(this.response));
	}
}
