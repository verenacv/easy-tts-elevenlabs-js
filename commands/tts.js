import { CommandInteraction, GuildMember } from 'discord.js';
import { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import { SlashCommandBuilder } from 'discord.js';
import { buildCustomEmbed, createErrorEmbed } from "../utils/embedHelpers.js";
import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from 'stream';

export default {
    data: new SlashCommandBuilder()
        .setName('tts')
        .setDescription('Convert text to speech using ElevenLabs.')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text you want to convert to speech.')
                .setRequired(true)
                .setMinLength(4)
        ),
    async execute(interaction) {
        try {
            const text = interaction.options.getString('text');
            const member = interaction.member;
            const voiceChannel = member.voice.channel;

            await interaction.deferReply();
            let replyEmbed;


            if (!voiceChannel) {
                const noVoiceChannelEmbed = await createErrorEmbed('You need to be in a voice channel to use this command!');
                await interaction.editReply({ embeds: [noVoiceChannelEmbed], ephemeral: true });
                return;
            }

            let connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            replyEmbed = await buildCustomEmbed('Joined Voice Channel', `The bot is ready to play audio.`);
            await interaction.editReply({ embeds: [replyEmbed], ephemeral: false });

            const elevenlabs = new ElevenLabsClient({
                apiKey: process.env.ELEVEN_LABS,
            });

            const audioStreamPromise = await elevenlabs.generate({
                stream: true,
                voice: "Aria",
                text: text,
                model_id: "eleven_turbo_v2_5"
            });

            const readableStream = new Readable({
                async read() {
                    const chunk = await audioStreamPromise.read();
                    if (chunk) {
                        this.push(chunk);
                    } else {
                        this.push(null);
                    }
                }
            });

            const resource = createAudioResource(readableStream);
            const player = createAudioPlayer();

            player.play(resource);
            connection.subscribe(player);

            // player.on(AudioPlayerStatus.Idle, () => {
            //     connection.destroy(); // Leave the voice channel when done
            // });

            replyEmbed = await buildCustomEmbed('Playing the converted speech.', `The bot has played the audio.`);
            replyEmbed.addFields({ name: 'Text to Speech', value: `\`${text}\``})

            await interaction.editReply({ embeds: [replyEmbed], ephemeral: false });

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.editReply({ content: 'There was an error executing the command.', ephemeral: true });
        }
    }
};
