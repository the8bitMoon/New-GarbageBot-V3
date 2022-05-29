const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription("Ask me a yes or no question and I'll answer it.")
		.addStringOption((option) =>
			option
				.setName('question')
				.setDescription('A yes or no question.')
				.setRequired(true),
		),
	async execute(interaction) {
		const question = interaction.options.getString('question');
		const answers = [
			'It is certain.',
			'It is decidedly so.',
			'Without a doubt.',
			'Yes definitely.',
			'You may rely on it.',
			'As I see it, yes.',
			'Most likely.',
			'Outlook good.',
			'Yes.',
			'Signs point to yes.',
			'Reply hazy, try again.',
			'Ask again later.',
			'Better not tell you now.',
			'Cannot predict now.',
			'Concentrate and ask again.',
			"Don't count on it.",
			'My reply is no.',
			'My sources say no.',
			'Outlook not so good.',
			'Very doubtful.',
		];

		const answer = interaction.client.helpers.randomElement(answers);

		return interaction.reply(`🎱 ${question}\n🎱 ${answer}`);
	},
};
