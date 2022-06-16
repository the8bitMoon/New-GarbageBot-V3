const { ContextMenuCommandBuilder, codeBlock } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('download-messages').setType(3),
	async execute(interaction) {
		// disallow everyone except bot owner
		if (interaction.user.id !== process.env.ownerId) {
			return interaction.reply('This command is for the bot owner!', {
				ephemeral: true,
			});
		}
		const start = interaction.targetMessage;
		const fetched = await interaction.channel.messages.fetch({
			limit: 99,
			after: start.id,
		});

		const messages = [...fetched.values(), start]
			.reverse()
			.map((message, i) => {
				return {
					frameId: i + 1,
					text: message.cleanContent,
					userId: message.author.id,
					name: message.author.tag,
					attachments: message.attachments,
					timestamp: message.createdTimestamp,
					embeds: message.embeds,
				};
			});

		const authors = new Set(
			...[messages].map((m) => {
				return { user: m.userId, name: m.name };
			}),
		);
		console.log(authors);
		const stringified = JSON.stringify(messages, null, '\t');

		console.log(stringified);

		const attachment = new MessageAttachment(
			Buffer.from(stringified, 'utf-8'),
			'messages.json',
		);
		// return interaction.reply(codeBlock('json', stringified));
		return interaction.reply({
			content: 'Messages:',
			files: [attachment],
		});
	},
};
