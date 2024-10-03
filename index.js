import fs from 'fs';
import {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from 'discord.js';
import {config} from 'dotenv';

config();

const token = process.env.DISCORD_TOKEN;
import chalk from "chalk";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
    ],
    presence: {
        status: 'dnd',
    },
});
client.commands = new Collection();

// Load commands
async function loadCommands(client, path = './commands') {
    const commandFiles = await fs.promises.readdir(path);

    for (const file of commandFiles) {
        try {
            const filePath = `${path}/${file}`;
            if (file.endsWith('.js')) { // assuming command files have a .js extension
                const {default: command} = await import(filePath);
                await client.commands.set(command.data.name, command);
                console.info(`Loaded command ${command.data.name} (${filePath})`);
            } else {
                const subdirectoryFiles = await fs.promises.readdir(`${path}/${file}`);
                for (const subFile of subdirectoryFiles) {
                    if (subFile.endsWith('.js')) { // assuming subdirectories contain .js files
                        const subFilePath = `${path}/${file}/${subFile}`;
                        const {default: command} = await import(subFilePath);
                        await client.commands.set(command.data.name, command);
                        console.info(`Loaded command ${command.data.name} (${subFilePath})`);
                    }
                }
            }
        } catch (error) {
            console.warn(`Failed to load command ${path}/${file}. Please report the following error:`);
            console.error(error);
        }
    }

    console.info('Loaded Commands');
}

async function loadEvents(client, path = './events') {
    const eventFiles = await fs.promises.readdir(path);

    for (const file of eventFiles) {
        try {
            const {default: event} = await import(`${path}/${file}`);
            const listener = (...args) => event.execute(...args);

            if (event.once) {
                client.once(event.name, listener);
            } else {
                client.on(event.name, listener);
            }

            console.info(`Loaded event ${event.name} (${path}/${file})`);
        } catch (error) {
            console.warn(`Failed to load event ${path}/${file}. Please report the following error:`);
            console.error(error);
        }
    }

    console.log('Loaded Events');
}

client.on('ready', async () => {
    console.info(`
        Bot ${chalk.bold(client.user.tag)} is now online!
        Serving ${chalk.underline(client.guilds.cache.size.toString())} servers.
    `);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
    }
});

client.login(token).then(() => {
    loadCommands(client)
        .then(() => {
            loadEvents(client).then(r => {
            });
        })
        .catch((error) => {
            console.error('Failed to load commands and events:', error);
        });
});
