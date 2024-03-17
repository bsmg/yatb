const { ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: "edit_message",
    async execute(interaction) {
        const channel = interaction.message.embeds[0].footer.text;
        const message = interaction.message.embeds[0].description;
        const title = interaction.message.embeds[0].title;
        let color = interaction.message.embeds[0].color;

        color = color.toString(16);

        const modal = new ModalBuilder()
            .setTitle('Post a message')
            .setCustomId('update_message')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setValue(message)
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
                            .setValue(title)
                            .setCustomId('embed_title')
                            .setLabel('The title of the embed.')
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(1)
                            .setMaxLength(256)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setValue(`#${color}`)
                            .setCustomId('embed_color')
                            .setLabel('The color of the embed. (hex with #)')
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(7)
                            .setMaxLength(7)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setValue(channel)
                            .setCustomId('channel_id')
                            .setLabel('DO NOT TOUCH!!!!')
                            .setStyle(TextInputStyle.Short)
                    )
            )

        await interaction.showModal(modal);
    }
}