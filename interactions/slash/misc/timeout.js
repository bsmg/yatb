const { SlashCommandBuilder } = require('discord.js');
const db = require('../../../connectDb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket_timeout')
        .setDescription('Set the default ticket timeout after a close request.')
        .addIntegerOption(option =>
            option.setName('timeout')
                .setDescription('Timeout in days.')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (process.env.MANAGER_ROLE_ID && !interaction.member.roles.cache.has(process.env.MANAGER_ROLE_ID)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const settings = await db("settings")
            .select("*")
            .first()
    
        if (settings === undefined) {
            await db("settings")
                .insert({ ticket_timeout: interaction.options.getInteger('timeout') })
    
            return await interaction.reply({ content: "Timeout set!", ephemeral: true })
        }
    }
}