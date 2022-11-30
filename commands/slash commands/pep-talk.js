const {
	SlashCommandBuilder,
	ContextMenuCommandAssertions,
} = require('@discordjs/builders');
const { fetch } = require('undici');
const Canvas = require('@napi-rs/canvas');
const sizeOf = require('image-size');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pep-talk')
		.setDescription('Get some encouragement from an anime girl!'),
	async execute(interaction) {
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

		// Create the canvas with a width of 600px and keeping image aspect ratio.
		const canvas = Canvas.createCanvas(
			600,
			(600 / waifuDimensions.width) * waifuDimensions.height,
		);
		const ctx = canvas.getContext('2d');
		const bg = await Canvas.loadImage(img);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

		// Text formatting.
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 8;
		ctx.fillStyle = '#fff';
		ctx.font = `bold 60px sans-serif`;
		ctx.textAlign = 'left';

		// Draw the text.
		ctx.strokeText(line1, 40, canvas.height - 120, canvas.width - 40);
		ctx.strokeText(line2, 40, canvas.height - 50, canvas.width - 40);

		ctx.fillText(line1, 40, canvas.height - 120, canvas.width - 40);
		ctx.fillText(line2, 40, canvas.height - 50, canvas.width - 40);

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
