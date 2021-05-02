// #region Enums

export const enum Time {
	Millisecond = 1,
	Second = Millisecond * 1000,
	Minute = Second * 60,
	Hour = Minute * 60,
	Day = Hour * 24,
	Year = Day * 365
}

// #endregion Enums

// #region Interfaces

export interface Resolvable<V> {
	resolve(): V | Promise<V>;
}

export interface File {
	name: string;
	file: Buffer;
}

export interface ReferredPromise<V> {
	promise: Promise<V>;
	resolve(value?: V): void;
	reject(error?: Error): void;
}

// #endregion Interfaces
