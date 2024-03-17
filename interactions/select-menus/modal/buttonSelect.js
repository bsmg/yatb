const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../../../connectDb");

module.exports = {
    id: "tickets",
    async execute(interaction) {
        const values = interaction.values;
        const array = values.map((value) => `${value}`);

        const row = new ActionRowBuilder()

        for (const value of array) {
            const options = await db("buttons")
                .select("style", "label", "emoji", "id")
                .where("label", value)
                .first();

            const button = new ButtonBuilder()
                .setCustomId(options.id.toString())
                .setLabel(options.label)
                .setStyle(ButtonStyle[options.style])
                options.emoji ? button.setEmoji(options.emoji) : null;

            row.addComponents(button);
        }

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("accept_message")
                    .setLabel("Accept Message")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅")
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("delete_message")
                    .setLabel("Delete Message")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🗑️")
            )

        await interaction.update({ components: [row, row2] });
    }
}