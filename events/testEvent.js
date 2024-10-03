import {EmbedBuilder} from "discord.js";

export default {
    name: 'guildCreate',
    once: false,
    async execute(guild) {
        let defaultChannel;
        guild.channels.cache.forEach((channel) => {
            if (channel.type === 0 && channel.permissionsFor(guild.members.me).has('SendMessages') && !defaultChannel) {
                defaultChannel = channel;
            }
        });

        let description =
            `
            **Hello!** 🎉 Thanks for adding me to **${guild.name}**!
            **Have fun!** 🎮
            `;

        const embed =
            new EmbedBuilder()
                .setDescription(description)
                .setTimestamp()
                .setThumbnail(process.env.SERVER_ICON)

        if (defaultChannel) {
            defaultChannel.send({
                embeds: [embed],
            });
        }
    },
};
