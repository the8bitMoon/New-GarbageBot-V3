const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { btoa } = require('buffer');
const {
	MessageAttachment,
	Modal,
	MessageActionRow,
	TextInputComponent,
	MessageSelectMenu,
} = require('discord.js');
const Path = require('path');
const Objection = require(Path.join(__dirname, '..', 'objection-config.json'));

module.exports = {
	data: new ContextMenuCommandBuilder().setName('objection').setType(3),
	async execute(interaction) {
		// interaction.deferReply({ ephemeral: true });

		// === GET OPTIONS FROM USER ===
		const modalId = 'objection' + Date.now();
		const settingsModal = new Modal()
			.setCustomId(modalId)
			.setTitle('Create an Objection')
			.addComponents(
				new MessageActionRow().addComponents(
					new TextInputComponent()
						.setCustomId('nameInput')
						.setLabel('Name your Objection.')
						.setStyle('SHORT')
						.setValue(interaction.targetMessage.cleanContent.substring(0, 32)),
				),
				// new MessageActionRow().addComponents(
				// 	new MessageSelectMenu()
				// 		.setCustomId('styleInput')
				// 		.setPlaceholder('Textbox Style')
				// 		.addOptions([
				// 			{ label: 'Original Style', value: '0' },
				// 			{ label: 'Trilogy HD Style', value: '1', default: true },
				// 			{ label: 'Apollio Justice Style', value: '2' },
				// 			{ label: 'Chronicles Style', value: '3' },
				// 		]),
				// ),
				// new MessageActionRow().addComponents(
				// 	new MessageSelectMenu()
				// 		.setCustomId('optionsInput')
				// 		.setPlaceholder('Options')
				// 		.setMinValues(0)
				// 		.setMaxValues(2)
				// 		.addOptions(
				// 			[
				// 				{
				// 					label: 'Music',
				// 					description:
				// 						'Select music at random. Disable to set no music.',
				// 					value: 'musicDisabled',
				// 					default: true,
				// 				},
				// 				{
				// 					label: 'Anonymous',
				// 					description:
				// 						'If set, the objection will NOT replace character names with discord usernames.',
				// 					value: 'anonymous',
				// 				},
				// 			].sort((a, b) => a.label.localeCompare(b.label)),
				// 		),
				// ),
			);
		await interaction.showModal(settingsModal);
		interaction.client.on('interactionCreate', (modal) => {
			if (modal.customId !== modalId) return;
			// console.log('fields:', modal.fields.components[1].components);
			const options = {
				name: modal.fields.getTextInputValue('nameInput'),
				// style: modal.fields.getField('styleInput'),
				// options: modal.fields.getField('optionsInput'),
			};
			return run(modal, options, interaction);
		});
	},
};

const run = async (interaction, options, initialInteraction) => {
	const helpers = interaction.client.helpers;
	// === FETCH THE MESSAGES AND UNIQUE USERS ===
	const start = initialInteraction.targetMessage;
	const title = options.name
		? options.name
		: start.cleanContent
		? start.cleanContent.substring(0, 32)
		: 'objection';
	const fetched = await interaction.channel.messages.fetch({
		limit: 99,
		after: start.id,
	});

	// console.log(Objection);
	const messages = [...fetched.values(), start].reverse().map((message, i) => {
		return {
			frameId: i + 1,
			text: message.cleanContent
				.replace(
					/\*\*\*([^*]+)\*\*\*/gm,
					'[#p100][#fm][#sm][#bgs15][#/r]$1[/#]',
				)
				.replace(/\*\*([^*]+)\*\*/gm, '[#p100][#fs][#bgs9][#/g]$1[/#]')
				.replace(/\*([^*]+)\*/gm, '[#p100][#bgs3][#/b]$1[/#]'),
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
	const charGroups = [defense, prosecution, recurring, counsel];
	// console.log('charGroups:', charGroups);
	const characters = [
		...charGroups.map((group) => helpers.shuffleArray(group).shift()),
		...helpers.shuffleArray(charGroups.flat()),
	];
	// console.log('characters:', characters.length, characters);

	const characterMap = [...authors].map((user, i) => {
		return {
			id: 0,
			from: i < characters.length ? characters[i] : characters[0],
			to: user,
		};
	});
	// console.log(characterMap);
	const aliases = characterMap.map((t) => {
		return { ...t, from: t.from.name, to: t.to.split('#')[0] };
	});
	// console.log('aliases:', aliases);

	const frames = messages.map((msg) => {
		const character = characterMap.find((e) => e.to === msg.name).from;
		const bubble = msg.text.includes('!')
			? Objection.speechBubbles.objection
			: msg.text.includes('?')
			? Objection.speechBubbles.holdIt
			: 0;

		// Generate text with tags.
		let text = '';
		if (bubble && Math.random() > 0.5)
			text += helpers.randomElement(Objection.music.objection);
		if (msg.frameId === 1) text += helpers.randomElement(Objection.music.trial);
		text += msg.text;
		if (msg.attachments.size || msg.embeds.length)
			text += '\n[#bgs8][#/g][File submitted to court record.][/#]';

		return {
			iid: msg.frameId,
			text: text,
			poseId: helpers.randomElement(character.animations).id,
			bubbleType: bubble,
			poseAnimation: true,
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
	// console.log('frames:', frames);

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
				name: options.name,
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
		`${title}.objection`,
	);
	// return interaction.reply(codeBlock('json', stringified));
	return interaction.reply({
		content:
			"Here's your objection! Save this file then go to [objection.lol/maker](https://objection.lol/maker) to edit and submit.",
		files: [attachment],
		ephemeral: true,
	});
	return interaction.followUp({ content: 'Hello', ephemeral: true });
};
