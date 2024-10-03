import {EmbedBuilder} from 'discord.js';
import {config} from 'dotenv';

config();

const EMBED_ICON_URL = process.env.SERVER_ICON;

export async function createErrorEmbed(text) {
    const description = `
        **Error** ⚠️
        > ${text}
    `;

    return new EmbedBuilder()
        .setFooter({ text: "Tulip Dev", iconURL: EMBED_ICON_URL })
        .setDescription(description)
        .setTimestamp();
}

export async function buildCustomEmbed(title, description) {
    return new EmbedBuilder()
        .setAuthor({ name: "Tulip Dev", iconURL: EMBED_ICON_URL })
        .setThumbnail(EMBED_ICON_URL)
        .setTitle(title ?? 'No title')
        .setDescription(description ?? 'No description..')
        .setFooter({ text: 'Tulip Dev', iconURL: EMBED_ICON_URL })
        .setTimestamp();
}
