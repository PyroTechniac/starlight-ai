import type { Connection, Repository } from 'typeorm';
import { connect } from '../config';
import { GuildEntity } from '../entities/GuildEntity';

export class DbManager {
	public guilds: Repository<GuildEntity>;

	public constructor(public readonly connection: Connection) {
		this.guilds = this.connection.getRepository(GuildEntity);
	}

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
