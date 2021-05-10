import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('guilds')
export class GuildEntity extends BaseEntity {
	@PrimaryColumn('varchar', { name: 'id', length: 19 })
	public id!: string;
}
