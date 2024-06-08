const { EmbedBuilder } = require("discord.js");
const db = require("../../../connectDb");

module.exports = {
    id: "cancel_close",
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setDescription(`Close request cancelled by ${interaction.user}.`)
            .setColor("#B57EDC")

        await db("tickets")
            .update({ close_requested_at: null })
            .where("channel_id", interaction.channel.id)

        await interaction.update({ embeds: [embed], components: [] });
    }
}