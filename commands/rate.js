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
		)
		.addIntegerOption((option) =>
			option.setName('scale').setDescription('The rating scale.'),
		),

	async execute(interaction) {
		const thing = interaction.options.getString('thing');
		const scale = interaction.options.getInteger('scale');

		const rating = Math.floor(Math.random() * scale ? scale : 101);
		return interaction.reply(
			`I rate ${thing} **${rating}/${scale ? scale : 100}**.`,
		);
	},
};
