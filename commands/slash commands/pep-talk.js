const {
	SlashCommandBuilder,
	ContextMenuCommandAssertions,
} = require('@discordjs/builders');
const { fetch } = require('undici');
const Canvas = require('@napi-rs/canvas');
const sizeOf = require('image-size');
const { MessageAttachment } = require('discord.js');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pep-talk')
		.setDescription('Get some encouragement from an anime girl!'),
	async execute(interaction) {
		const imgWidth = 600;
		const pepTalks = {
			col1: [
				'Champ,',
				'Fact:',
				'Everybody says',
				'Dang...',
				'Check it:',
				'Just saying...',
				'Superstar,',
				'Tiger,',
				'Self,',
				'Know this:',
				'News alert:',
				'Girl,',
				'Ace,',
				'Excuse me but',
				'Experts agree:',
				'In my opinion,',
				'Hear ye, hear ye:',
				'Okay, listen up:',
			],
			col2: [
				'the mere idea of you',
				'your soul',
				'your hair today',
				'everything you do',
				'your personal style',
				'every thought you have',
				'that sparkle in your eye',
				'your presence here',
				'what you got going on',
				'the essential you',
				"your life's journey",
				'that saucy personality',
				'your DNA',
				'that brain of yours',
				'your choice of attire',
				'the way you roll',
				'whatever your secret is',
				"all of y'all",
			],
			col3: [
				'has serious game',
				'rains magic',
				'deserves the Nobel Prize',
				'raises the roof',
				'breeds miracles',
				'is paying off big time',
				'shows mad skills',
				'just shimmers',
				'is a national treasure',
				'gets the party hopping',
				'is the next big thing',
				'roars like a lion',
				'is a rainbow factory',
				'is made of diamonds',
				'makes birds sing',
				'should be taught in school',
				"makes my world go 'round",
				'is 100% legit',
			],
			col4: [
				'24//7',
				'cat I get an amen?',
				"and that's a fact.",
				'so treat yourself',
				'you feel me?',
				"that's just science.",
				'would I lie?',
				'for reals.',
				'mic drop.',
				'you hidden gem.',
				'snuggle bear.',
				'period.',
				'on god.',
				"now let's dance.",
				'high five.',
				'say it again!',
				'according to CNN.',
				'so get used to it.',
			],
		};

		const choices = [
			interaction.client.helpers.randomElement(pepTalks.col1),
			interaction.client.helpers.randomElement(pepTalks.col2),
			interaction.client.helpers.randomElement(pepTalks.col3),
			interaction.client.helpers.randomElement(pepTalks.col4),
		];

		const line1 = `${choices[0]} ${choices[1]}`;
		const line2 = `${choices[2]}, ${choices[3]}`;

		// grab a random waifu image
		const waifuResponse = await (
			await fetch('https://api.waifu.pics/sfw/waifu')
		).json();
		const url = waifuResponse.url;
		const img = await interaction.client.helpers.getImageBuffer(url);
		const waifuDimensions = sizeOf(img);

		// Create the canvas with fixed width, keeping aspect ratio.
		const canvas = Canvas.createCanvas(
			imgWidth,
			(imgWidth / waifuDimensions.width) * waifuDimensions.height,
		);
		const ctx = canvas.getContext('2d');
		const bg = await Canvas.loadImage(img);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

		// Get the font.
		Canvas.GlobalFonts.registerFromPath(
			path.join(__dirname, '..', '..', 'assets', 'Anton-Regular.ttf'),
			'Anton',
		);

		// Find the correct font size
		let fontSize = 70;
		do {
			ctx.font = `${(fontSize -= 5)}px Anton`;
			console.log(ctx.font);
		} while (
			ctx.measureText(line1).width > canvas.width - 20 ||
			ctx.measureText(line2).width > canvas.width - 20
		);

		// Text formatting.
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 8;
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';

		// Draw the text.
		ctx.strokeText(line1, canvas.width / 2, canvas.height - fontSize * 2.5);
		ctx.strokeText(line2, canvas.width / 2, canvas.height - fontSize * 1.25);

		ctx.fillText(line1, canvas.width / 2, canvas.height - fontSize * 2.5);
		ctx.fillText(line2, canvas.width / 2, canvas.height - fontSize * 1.25);

		const attachment = new MessageAttachment(
			await canvas.encode('jpeg'),
			'encouragement.jpg',
		);
		await interaction.deferReply();
		return interaction.followUp({
			content: ' ',
			files: [attachment],
		});
	},
};
