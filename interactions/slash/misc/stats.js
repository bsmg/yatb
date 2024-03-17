const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../connectDb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Ticket stats.')
        .addSubcommand(
            subcommand =>
                subcommand
                    .setName('general')
                    .setDescription('General ticket stats.')
        )
        .addSubcommand(
            subcommand =>
                subcommand
                    .setName('category')
                    .setDescription('Category ticket stats.')
                    .addStringOption(
                        option =>
                            option
                                .setName('category')
                                .setDescription('Category to get stats from.')
                                .setRequired(true)
                    )
        )
        .addSubcommand(
            subcommand =>
                subcommand
                    .setName('user')
                    .setDescription('User ticket stats.')
                    .addUserOption(
                        option =>
                            option
                                .setName('user')
                                .setDescription('User to get stats from.')
                                .setRequired(true)
                    )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "general") {
            const tickets = await db("tickets")
                .select("*")

            const open = tickets.filter(ticket => ticket.status === "open").length
            const closed = tickets.filter(ticket => ticket.status === "closed").length

            return interaction.reply({ content: `Open tickets: ${open}\nClosed tickets: ${closed}\nAll tickets: ${open + closed}` })
        }
        else if (subcommand === "category") {
            const category = interaction.options.getString("category");

            const tickets = await db("tickets")
                .select("*")

            const categoryTickets = tickets.filter(ticket => ticket.ticket_id === category)

            const open = categoryTickets.filter(ticket => ticket.status === "open").length
            const closed = categoryTickets.filter(ticket => ticket.status === "closed").length

            return interaction.reply({ content: `Open tickets: ${open}\nClosed tickets: ${closed}\nAll tickets: ${open + closed}` })
        }
        else {
            const user = interaction.options.getUser("user");

            const tickets = await db("tickets")
                .select("*")

            const userTickets = tickets.filter(ticket => ticket.closed_by === user.id).length

            return interaction.reply({ content: `This user has closed ${userTickets} tickets` })
        }
    }
}