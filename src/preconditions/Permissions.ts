import * as Framework from '@sapphire/framework';
import * as DJS from 'discord.js';

export default class CorePrecondition extends Framework.Precondition {
	private readonly dmChannelPermissions = new DJS.Permissions([
		DJS.Permissions.FLAGS.VIEW_CHANNEL,
		DJS.Permissions.FLAGS.SEND_MESSAGES,
		DJS.Permissions.FLAGS.SEND_TTS_MESSAGES,
		DJS.Permissions.FLAGS.EMBED_LINKS,
		DJS.Permissions.FLAGS.ATTACH_FILES,
		DJS.Permissions.FLAGS.READ_MESSAGE_HISTORY,
		DJS.Permissions.FLAGS.MENTION_EVERYONE,
		DJS.Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
		DJS.Permissions.FLAGS.ADD_REACTIONS
	]).freeze();

	public run(message: DJS.Message, _: Framework.Command, context: Framework.PreconditionContext): Framework.PreconditionResult {
		const required = (context.permissions as DJS.Permissions) ?? new DJS.Permissions(0);
		const permissions = message.guild
			? (message.channel as DJS.TextChannel | DJS.NewsChannel).permissionsFor(message.client.id!)!
			: this.dmChannelPermissions;
		const missing = permissions.missing(required);
		return missing.length === 0
			? this.ok()
			: this.error({
					identifier: Framework.Identifiers.PreconditionPermissions,
					message: `I am missing the following permissions to run this command: ${missing
						.map((perm) => CorePrecondition.readablePermissions[perm])
						.join(', ')}`,
					context: { missing }
			  });
	}

	protected static readonly readablePermissions = {
		ADMINISTRATOR: 'Administrator',
		VIEW_AUDIT_LOG: 'View Audit Log',
		MANAGE_GUILD: 'Manage Server',
		MANAGE_ROLES: 'Manage Roles',
		MANAGE_CHANNELS: 'Manage Channels',
		KICK_MEMBERS: 'Kick Members',
		BAN_MEMBERS: 'Ban Members',
		CREATE_INSTANT_INVITE: 'Create Instant Invite',
		CHANGE_NICKNAME: 'Change Nickname',
		MANAGE_NICKNAMES: 'Manage Nicknames',
		MANAGE_EMOJIS: 'Manage Emojis',
		MANAGE_WEBHOOKS: 'Manage Webhooks',
		VIEW_CHANNEL: 'Read Messages',
		SEND_MESSAGES: 'Send Messages',
		SEND_TTS_MESSAGES: 'Send TTS Messages',
		MANAGE_MESSAGES: 'Manage Messages',
		EMBED_LINKS: 'Embed Links',
		ATTACH_FILES: 'Attach Files',
		READ_MESSAGE_HISTORY: 'Read Message History',
		MENTION_EVERYONE: 'Mention Everyone',
		USE_EXTERNAL_EMOJIS: 'Use External Emojis',
		ADD_REACTIONS: 'Add Reactions',
		CONNECT: 'Connect',
		SPEAK: 'Speak',
		STREAM: 'Stream',
		MUTE_MEMBERS: 'Mute Members',
		DEAFEN_MEMBERS: 'Deafen Members',
		MOVE_MEMBERS: 'Move Members',
		USE_VAD: 'Use Voice Activity',
		PRIORITY_SPEAKER: 'Priority Speaker',
		VIEW_GUILD_INSIGHTS: 'View Guild Insights'
	};
}
