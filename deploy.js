import { REST, Routes } from 'discord.js';
import fs from 'fs';
import { config } from 'dotenv';

config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const commands = [];

async function readdir(path = './commands') {
    const allCommands = fs.readdirSync(path).filter(file => !file.startsWith('index.') && file !== 'bot.js');

    for (const command of allCommands) {
        const commandPath = `${path}/${command}`;
        if (fs.statSync(commandPath).isDirectory()) {
            await readdir(commandPath);
            continue;
        }

        try {
            const loaded = await import(commandPath);
            const obj = loaded.default;
            commands.push(obj.data.toJSON());
            console.info(`registered command ${obj.data.name} (${commandPath})`);
        } catch (error) {
            console.warn(`Failed to load command ${commandPath}. **Please report the following error:**`);
            console.error(error.stack);
        }
    }
}


async function refreshCommands() {
    try {
        console.debug(`Started refreshing ${commands.length} application (/) commands.`);
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
            body: commands
        });
        console.info(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

async function start() {
    await readdir();
    await refreshCommands();
}

start().then(r => {});