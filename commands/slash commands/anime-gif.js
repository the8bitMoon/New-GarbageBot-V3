const {
	SlashCommandBuilder,
	ContextMenuCommandBuilder,
} = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { execute } = require('./trivia');

const keywords = ['hug', 'kiss', 'kick', 'slap'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anime-gif')
		.setDescription('Send a random anime gif.')
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('the gif you want')
				// .setChoices(...keywords.map((t) => ({ name: t, value: t })))
				.setRequired(true),
		)
		.addUserOption((option) =>
			option.setName('target').setDescription('Ping someone.'),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const keyword = interaction.options.getString('category');
		const gif = await interaction.client.helpers.animeGif(keyword);
		const attachment = new MessageAttachment(
			gif,
			`${encodeURIComponent(keyword)}.gif`,
		);
		await interaction.deferReply();
		return interaction.followUp({
			content: `${target || ' '}`,
			files: [attachment],
		});
	},
};
