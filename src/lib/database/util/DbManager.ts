import type { Connection } from 'typeorm';
import { connect } from '../config';

export class DbManager {
	public constructor(public readonly connection: Connection) {}

	public static instance: DbManager | null = null;
	private static connectPromise: Promise<DbManager> | null = null;

	public static async connect(): Promise<DbManager> {
		return (DbManager.instance ??= await (DbManager.connectPromise ??= connect().then(
			(connection): DbManager => {
				DbManager.connectPromise = null;
				return new DbManager(connection);
			}
		)));
	}
}
