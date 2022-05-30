const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Give someone a hug. ❤️')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The member to hug.')
				.setRequired(true),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const gif = await interaction.client.helpers.animeGif('hug');
		console.log(gif);
		const attachment = new MessageAttachment(gif, 'hug.gif', {
			description: `${interaction.target} got a hug!`,
		});

		await interaction.deferReply();
		return interaction.editReply({
			content: `${interaction.user} gives ${target} a big hug. ❤️`,
			files: [attachment],
		});
	},
};
