const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Repeats your message back to you.')
		.addStringOption((option) =>
			option
				.setName('text')
				.setDescription('The message to repeat.')
				.setRequired(true),
		),
	async execute(interaction) {
		const message = interaction.options.getString('text');
		return interaction.reply(message);
	},
};
