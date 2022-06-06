const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite-me')
		.setDescription('Posts my invite link so you can add me to your server.'),
	async execute(interaction) {
		const link = interaction.client.generateInvite({
			scopes: ['bot', 'applications.commands'],
			permissions: [
				Permissions.FLAGS.ADD_REACTIONS,
				Permissions.FLAGS.SEND_MESSAGES,
				Permissions.FLAGS.EMBED_LINKS,
				Permissions.FLAGS.ATTACH_FILES,
				Permissions.FLAGS.MENTION_EVERYONE,
				Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
				Permissions.FLAGS.CHANGE_NICKNAME,
				Permissions.FLAGS.MANAGE_ROLES,
				Permissions.FLAGS.MANAGE_WEBHOOKS,
				Permissions.FLAGS.MANAGE_EVENTS,
				Permissions.FLAGS.MANAGE_THREADS,
				Permissions.FLAGS.CREATE_PUBLIC_THREADS,
				Permissions.FLAGS.CREATE_PRIVATE_THREADS,
				Permissions.FLAGS.SEND_MESSAGES_IN_THREADS,
			],
		});
		return interaction.reply(
			`You can grab my invite link right [here](${link})!`,
		);
	},
};
