const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const helpers = require(path.join(__dirname, 'helpers.js'));

// Instantiate environment variables.
dotenv.config();
// const { clientId, testGuilds, token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.helpers = helpers;

// Command Handler
client.commands = new Collection();
const commandDirs = [
	path.join(__dirname, 'commands', 'slash commands'),
	path.join(__dirname, 'commands', 'context commands'),
];
for (const commandsPath of commandDirs) {
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}
}
// const commandFiles = [
// 	fs.readdirSync(slashCommandsPath).filter((file) => file.endsWith('.js')),
// 	fs.readdirSync(contextCommandsPath).filter((file) => file.endsWith('.js')),
// ];

// for (const commandDir of commandFiles) {

// }

// Event Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.testToken);
