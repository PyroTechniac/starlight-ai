import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('guilds')
export class GuildEntity extends BaseEntity {
	@PrimaryColumn('varchar', { name: 'id', length: 19 })
	public id!: string;

	@Column('varchar', { name: 'language', default: 'en-US' })
	public language = 'en-US';

	@Column('varchar', { name: 'prefix', length: 10, default: process.env.PREFIX })
	public prefix = process.env.PREFIX;
}
