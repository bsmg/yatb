const { SlashCommandBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('post')
        .setDescription('Post a message for tickets.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to post the message in.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        const modal = new ModalBuilder()
            .setTitle('Post a message')
            .setCustomId('post_message')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setPlaceholder('Message')
                            .setCustomId('message')
                            .setLabel('The message. Markdown supported.')
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(10)
                            .setMaxLength(2000)
                            .setRequired(true)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setPlaceholder('Embed Title')
                            .setCustomId('embed_title')
                            .setLabel('The title of the embed.')
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(1)
                            .setMaxLength(256)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setPlaceholder('Embed Color')
                            .setCustomId('embed_color')
                            .setLabel('The color of the embed. (hex with #)')
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(7)
                            .setMaxLength(7)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setValue(channel.id)
                            .setCustomId('channel_id')
                            .setLabel('DO NOT TOUCH!!!!')
                            .setStyle(TextInputStyle.Short)
                    )
            )

        await interaction.showModal(modal);
    }
}