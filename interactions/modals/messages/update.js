const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../../../connectDb");

module.exports = {
    id: "update_message",
    async execute(interaction) {
        const message = interaction.fields.getTextInputValue("message");
        const title = interaction.fields.getTextInputValue("embed_title");
        const color = interaction.fields.getTextInputValue("embed_color");
        const channel = interaction.fields.getTextInputValue("channel_id");

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setColor(color)
            .setFooter({ text: `${channel}` })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("edit_message")
                    .setLabel("Edit Message")
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("delete_message")
                    .setLabel("Delete Message")
                    .setStyle(ButtonStyle.Danger)
            )

        const tickets = await db("buttons")
            .select("label")

        const options = tickets.map((ticket) => ({ label: ticket.label, value: ticket.label }))

        const row2 = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("tickets")
                    .addOptions(options)
                    .setMinValues(1)
                    .setMaxValues(tickets.length < 5 ? tickets.length : 5)
                    .setPlaceholder("Select ticket categories")
            )

        await interaction.update({ embeds: [embed], components: [row, row2] });
    }
}