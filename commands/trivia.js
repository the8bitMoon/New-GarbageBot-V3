const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message } = require('discord.js');
const { fetch } = require('undici');
const delay = require('node:timers/promises').setTimeout;

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
		const pauseTime = 5_000;
		const url =
			'https://opentdb.com/api.php' +
			`?amount=${length}` +
			(category !== null ? `&category=${category}` : '') +
			(difficulty !== null ? `&difficulty=${difficulty}` : '') +
			'&encode=url3986';
		console.log(url);

		let scoreTracker = {};

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
			`Starting ${length} question trivia game in ${
				timeLimit / 1_000
			} seconds!` +
			(category
				? `\nCategory: ${triviaCategories
						.find((obj) => obj.value == category)
						.name.toLocaleUpperCase()}`
				: '') +
			(difficulty ? `\nDifficulty: ${difficulty.toLocaleUpperCase()}` : '');

		// Send the intro message
		await interaction.reply(initMessage);
		const message = await interaction.fetchReply();

		// Create a thread for the game
		const thread = await message.startThread({
			name: 'Trivia',
			autoArchiveDuration: 60,
		});

		// Pause before beginning the game
		await delay(timeLimit - pauseTime);
		for (const question of questions) {
			// await console.log(question);
			// Pause a moment between questions
			await delay(pauseTime);

			// Generate the buttons.
			const btns = question.answers
				.map((a) => {
					return new MessageButton()
						.setCustomId(`${a.id}`)
						.setLabel(a.content)
						.setStyle('PRIMARY');
				})
				.sort((a, b) => a.label.localeCompare(b.label));

			if (btns.length === 2) btns.reverse();

			// Send the question
			const qMessage = await thread.send({
				content: question.question,
				components: [new MessageActionRow().addComponents(btns)],
			});

			// Collect guild member responses.
			const correctResponses = [];
			const userSet = new Set();
			const collector = qMessage.createMessageComponentCollector({
				componentType: 'BUTTON',
				time: timeLimit,
			});

			collector.on('collect', async (i) => {
				// Check if user has already responded, and add their response if they haven't.
				if (!userSet.has(i.user.id)) {
					if (i.customId === '0') correctResponses.push(i.user);
					userSet.add(i.user.id);
					i.deferUpdate();
				} else {
					i.reply({
						content: "You've already sent an answer.",
						ephemeral: true,
					});
				}
			});

			collector.on('end', async () => {
				// List the players that responded correctly.
				const winners = correctResponses.join(', ');
				correctResponses.forEach((user) => {
					scoreTracker[user.id] =
						scoreTracker[user.id] !== undefined ? scoreTracker[user.id] + 1 : 1;
				});

				// Edit the buttons to display the correct answer and disable them.
				const disabled = btns.map((btn) => {
					return new MessageButton()
						.setCustomId(btn.customId)
						.setLabel(btn.label)
						.setDisabled(true)
						.setStyle(btn.customId === '0' ? 'SUCCESS' : 'DANGER');
				});
				await qMessage.edit({
					content: `${question.question}\nWinners: ${winners}`,
					components: [new MessageActionRow().addComponents(disabled)],
				});
			});
			await delay(timeLimit);
		}

		// Display the winners!
		const gameWinners = Object.entries(scoreTracker)
			.sort((a, b) => b[1] - a[1])
			.map((value, i) => {
				const ordinal = `${i + 1}.`;
				const user = interaction.client.users.cache.get(value[0]);
				const score = `${value[1]}/${length}`;
				return `${ordinal} ${user}: ${score}`;
			})
			.join('\n');

		thread.send(`Thanks for playing!\n${gameWinners}`);
	},
};
