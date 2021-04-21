export const noop = (): null => null;

export const filterArray = <V>(array: V[]): V[] => [...new Set(array)];
