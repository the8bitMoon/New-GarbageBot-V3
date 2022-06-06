const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('wheeze').setDescription('Wheeze!'),
	async execute(interaction) {
		return interaction.reply(
			'https://tenor.com/view/wheeze-laugh-gif-14359545!',
		);
	},
};
