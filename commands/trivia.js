const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message } = require('discord.js');
const { fetch } = require('undici');
const path = require('node:path');
const { delay, shuffleArray } = require(path.join(
	__dirname,
	'..',
	'helpers.js',
));

const triviaCategories = [
	{ value: '9', name: 'General Knowledge' },
	{ value: '10', name: 'Books' },
	{ value: '11', name: 'Film' },
	{ value: '12', name: 'Music' },
	{ value: '13', name: 'Musicals & Theatres' },
	{ value: '14', name: 'Television' },
	{ value: '15', name: 'Video Games' },
	{ value: '16', name: 'Board Games' },
	{ value: '17', name: 'Science & Nature' },
	{ value: '18', name: 'Computers' },
	{ value: '19', name: 'Mathematics' },
	{ value: '20', name: 'Mythology' },
	{ value: '21', name: 'Sports' },
	{ value: '22', name: 'Geography' },
	{ value: '23', name: 'History' },
	{ value: '24', name: 'Politics' },
	{ value: '25', name: 'Art' },
	{ value: '26', name: 'Celebrities' },
	{ value: '27', name: 'Animals' },
	{ value: '28', name: 'Vehicles' },
	{ value: '29', name: 'Comics' },
	{ value: '30', name: 'Gadgets' },
	{ value: '31', name: 'Anime & Manga' },
	{ value: '32', name: 'Cartoon & Animations' },
].sort((a, b) => a.name.localeCompare(b.name));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play a trivia game!')
		.addIntegerOption((option) =>
			option
				.setName('length')
				.setDescription('The number of questions. (1-25)')
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
			(difficulty !== null ? `&difficulty=${difficulty}` : '') +
			'&encode=url3986';
		console.log(url);

		const response = await (await fetch(url)).json();

		const questions = response.results.map((i) => {
			const q = decodeURIComponent(i.question);
			const answers = [i.correct_answer, ...i.incorrect_answers].map(
				(content, id) => {
					return { id: id, content: decodeURIComponent(content) };
				},
			);
			console.log(answers);
			return { question: q, answers: answers };
		});

		console.log(questions);
		const initMessage =
			`Starting ${length} question trivia gamein 30 seconds!` +
			(category ? `\nCategory: ${triviaCategories[category].name}` : '') +
			(difficulty ? `\nDifficulty: ${difficulty}` : '');

		// Send the intro message
		await interaction.reply(initMessage);
		const message = await interaction.fetchReply();

		// Create a thread for the game
		const thread = await message.startThread({
			name: 'Trivia',
			autoArchiveDuration: 60,
		});

		questions.forEach((element, i) => {
			console.log(element);

			// Generate buttons.
			const btns = shuffleArray(
				element.answers.map((a) => {
					return new MessageButton()
						.setCustomId(`${a.id}`)
						.setLabel(a.content)
						.setStyle('PRIMARY');
				}),
			);
			console.log(btns);

			// Wait for the time limit.
			delay(timeLimit * (i + 1)).then(() => {
				thread.send({
					content: element.question,
					components: [new MessageActionRow().addComponents(btns)],
				});
			});
		});
	},
};
