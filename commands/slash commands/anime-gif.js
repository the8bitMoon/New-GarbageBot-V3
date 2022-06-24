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
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The user to ping.')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('the gif you want')
				.setChoices(...keywords.map((t) => ({ name: t, value: t })))
				.setRequired(true),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const keyword = interaction.options.getString('category');
		const gif = await interaction.client.helpers.animeGif(keyword);
		const attachment = new MessageAttachment(gif, `${keyword}.gif`);
		await interaction.deferReply();
		return interaction.editReply({
			content: `${interaction.user} gives ${target} a ${keyword}!`,
			files: [attachment],
		});
	},
};
