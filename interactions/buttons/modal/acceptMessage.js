const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: "accept_message",
    async execute(interaction) {
        const channel = interaction.message.embeds[0].footer.text;
        const message = interaction.message.embeds[0].description;
        const title = interaction.message.embeds[0].title;
        const color = interaction.message.embeds[0].color;
        const actionRow = interaction.message.components[0];

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setColor(color)
        
        const channelSend = interaction.client.channels.cache.get(channel);
        await channelSend.send({ embeds: [embed], components: [actionRow] });
        interaction.update({ content: `Message sent in <#${channel}>`, components: [], embeds: [] });
    }
}