const { SlashCommandBuilder } = require("discord.js");

const closeRequestEmbed = require("closeRequestEmbed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close a ticket.'),
    async execute(interaction) {
        closeRequestEmbed(interaction);
    }
}