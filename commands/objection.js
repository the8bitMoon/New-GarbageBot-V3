const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { btoa } = require('buffer');
const { MessageAttachment } = require('discord.js');
const Path = require('path');
const Objection = require(Path.join(__dirname, '..', 'objection-config.json'));

module.exports = {
	data: new ContextMenuCommandBuilder().setName('objection').setType(3),
	async execute(interaction) {
		const helpers = interaction.client.helpers;
		// // disallow everyone except bot owner
		// if (interaction.user.id !== process.env.ownerId) {
		// 	return interaction.reply('This command is for the bot owner!', {
		// 		ephemeral: true,
		// 	});
		// }

		// === FETCH THE MESSAGES AND UNIQUE USERS ===
		const start = interaction.targetMessage;
		const fetched = await interaction.channel.messages.fetch({
			limit: 99,
			after: start.id,
		});

		// console.log(Objection);

		const messages = [...fetched.values(), start]
			.reverse()
			.map((message, i) => {
				return {
					frameId: i + 1,
					text: message.cleanContent,
					userId: message.author.id,
					name: message.author.tag,
					attachments: message.attachments,
					timestamp: message.createdTimestamp,
					embeds: message.embeds,
				};
			});
		// console.log('messages:', messages);

		const authors = new Set([...messages.map((m) => m.name)]);
		// console.log('authors:', authors);

		// === OBJECTION SCENE PARAMETERS ===
		const defense = Objection.defense.characters.map((c) => {
			return { ...c, align: Objection.defense.align };
		});
		const prosecution = Objection.prosecution.characters.map((c) => {
			return { ...c, align: Objection.prosecution.align };
		});
		const counsel = Objection.counsel.characters.map((c) => {
			return { ...c, align: 0, backgroundId: Objection.counsel.backgroundId };
		});
		const recurring = Objection.recurring.characters.map((c) => {
			return { ...c, align: c.align ? c.align : Objection.recurring.align };
		});

		// Shuffle the characters, ensuring that each slot is filled.
		const charGroups = [defense, prosecution, counsel, recurring];
		const characters = [
			...charGroups.forEach((group) => helpers.shuffleArray(group).shift()),
			...helpers.shuffleArray(charGroups.flat()),
		];
		console.log('characters:', characters.length, characters);

		const characterMap = [...authors].map((user, i) => {
			return {
				id: 0,
				from: i < characters.length ? characters[i] : characters[0], // replace with gallery
				to: user,
			};
		});
		// console.log(characterMap);

		const aliases = characterMap.map((t) => {
			return { ...t, from: t.from.name, to: t.to.split('#')[0] };
		});
		console.log('aliases:', aliases);

		const frames = messages.map((msg) => {
			const character = characterMap.find((e) => e.to === msg.name).from;
			const bubble = msg.text.includes('!')
				? Objection.speechBubbles.objection
				: msg.text.includes('?')
				? Objection.speechBubbles.holdIt
				: 0;
			return {
				iid: msg.frameId,
				text: msg.text,
				poseId: helpers.randomElement(character.animations).id,
				bubbleType: bubble,
				backgroundId:
					character.backgroundId === undefined
						? Objection.backgroundId
						: character.backgroundId,
				transition: {
					left: character.align,
					duration: bubble ? 500 : 0,
					easing: bubble ? Objection.easing : null,
				},
			};
		});
		console.log('frames:', frames);

		// Generate the objection scene
		const scene = {
			type: Objection.type,
			options: {
				chatbox: Objection.chatbox,
				textSpeed: Objection.textSpeed,
				textBlipFrequency: Objection.textBlipFrequency,
				autoplaySpeed: Objection.autoplaySpeed,
				continueSoundUrl: Objection.continueSoundUrl,
			},
			groups: [
				{
					iid: 1,
					name: 'Main',
					type: 'n',
					frames: frames,
				},
			],
			aliases: aliases,
		};

		const stringified = btoa(
			unescape(encodeURIComponent(JSON.stringify(scene, null, '\t'))),
		);
		// console.log(stringified);

		const attachment = new MessageAttachment(
			Buffer.from(stringified, 'utf-8'),
			`${start.cleanContent.substring(0, 16)}.objection`,
		);
		// return interaction.reply(codeBlock('json', stringified));
		return interaction.reply({
			content:
				"Here's your objection! Save this file then go to [objection.lol/maker](https://objection.lol/maker) to edit and submit your objection!",
			files: [attachment],
			ephemeral: true,
		});
	},
};
