const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('wheeze').setDescription('Wheeze!'),
	async execute(interaction) {
		const gif = await interaction.client.helpers.tenorGif('14359545');

		const attachment = new MessageAttachment(gif, 'wheeze.gif');

		await interaction.deferReply();
		return interaction.editReply({
			files: [attachment],
		});
	},
};
