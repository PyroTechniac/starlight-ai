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

// #region Utils

export type CustomGet<K extends string, TCustom> = K & { __custom__: TCustom };

export type CustomFunctionGet<K extends string, TArgs, TReturn> = K & { __args__: TArgs; __return__: TReturn };

export function T<TCustom = string>(k: string): CustomGet<string, TCustom> {
	return k as CustomGet<string, TCustom>;
}

export function FT<TArgs, TReturn = string>(k: string): CustomFunctionGet<string, TArgs, TReturn> {
	return k as CustomFunctionGet<string, TArgs, TReturn>;
}

// #endregion Utils
