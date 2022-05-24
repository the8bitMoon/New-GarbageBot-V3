const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rate')
		.setDescription('Have me rate something out of 100.')
		.addStringOption((option) =>
			option
				.setName('thing')
				.setDescription("The thing I'm rating.")
				.setRequired(true),
		),
	async execute(interaction) {
		const thing = interaction.options.getString('thing');
		return interaction.reply(
			`I rate ${thing} **${Math.floor(Math.random() * 101)}/100.**`,
		);
	},
};
