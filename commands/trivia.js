const { SlashCommandBuilder } = require('@discordjs/builders');
const { fetch } = require('undici');

const triviaCategories = [
	{ value: '9', name: 'General Knowledge' },
	{ value: '10', name: 'Entertainment: Books' },
	{ value: '11', name: 'Entertainment: Film' },
	{ value: '12', name: 'Entertainment: Music' },
	{ value: '13', name: 'Entertainment: Musicals & Theatres' },
	{ value: '14', name: 'Entertainment: Television' },
	{ value: '15', name: 'Entertainment: Vvalueeo Games' },
	{ value: '16', name: 'Entertainment: Board Games' },
	{ value: '17', name: 'Science & Nature' },
	{ value: '18', name: 'Science: Computers' },
	{ value: '19', name: 'Science: Mathematics' },
	{ value: '20', name: 'Mythology' },
	{ value: '21', name: 'Sports' },
	{ value: '22', name: 'Geography' },
	{ value: '23', name: 'History' },
	{ value: '24', name: 'Politics' },
	{ value: '25', name: 'Art' },
	{ value: '26', name: 'Celebrities' },
	{ value: '27', name: 'Animals' },
	{ value: '28', name: 'Vehicles' },
	{ value: '29', name: 'Entertainment: Comics' },
	{ value: '30', name: 'Science: Gadgets' },
	{ value: '31', name: 'Entertainment: Japanese Anime & Manga' },
	{ value: '32', name: 'Entertainment: Cartoon & Animations' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play a trivia game!')
		.addIntegerOption((option) =>
			option
				.setName('length')
				.setDescription('The number of questions.')
				.setMinValue(1)
				.setMaxValue(25),
		)
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('The category of questions.')
				.addChoices(...triviaCategories),
		)
		.addStringOption((option) =>
			option
				.setName('difficulty')
				.setDescription('The difficulty level.')
				.addChoices(
					{ name: 'Easy', value: 'easy' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'Hard', value: 'hard' },
				),
		),

	async execute(interaction) {
		const length = interaction.options.getInteger('length')
			? interaction.options.getInteger('length')
			: 10;
		const category = interaction.options.getString('category')
			? interaction.options.getString('category')
			: null;
		const difficulty = interaction.options.getString('difficulty')
			? interaction.options.getString('difficulty')
			: null;
		const timeLimit = 30_000;
		const url =
			'https://opentdb.com/api.php' +
			`?amount=${length}` +
			(category !== null ? `&category=${category}` : '') +
			(difficulty !== null ? `&difficulty=${difficulty}` : '');

		const response = await (await fetch(url)).json();

		const questions = response.results.map((i) => {
			const q = i.question;
			const answers = [i.correct_answer, ...i.incorrect_answers].map(
				(content, id) => {
					return { id: id, content: content };
				},
			);

			return { question: q, answers: answers };
		});

		console.log(questions);
		return interaction.reply('.');
	},
};
