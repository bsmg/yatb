const { SlashCommandBuilder } = require('discord.js');
const db = require('../../../connectDb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage role access.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Role to add.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Role to remove.')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        if (process.env.MANAGER_ROLE_ID && !interaction.member.roles.cache.has(process.env.MANAGER_ROLE_ID)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const role = interaction.options.getRole('role');

        const roles = await db("settings")
            .select("roles")
            .first()

        if (interaction.options.getSubcommand() === "add") {
            if (roles === undefined) {
                await db("settings")
                    .insert({ roles: [role.id] })

                return await interaction.reply({ content: "Role added!", ephemeral: true })
            }

            if (roles.roles.includes(role.id)) {
                return interaction.reply({ content: "This role is already added.", ephemeral: true })
            }

            roles.roles.push(role.id)

            await db("settings")
                .update({ roles: roles.roles })

            await interaction.reply({ content: "Role added!", ephemeral: true })
        }

        else {
            if (roles === undefined) {
                return interaction.reply({ content: "There are no roles added.", ephemeral: true })
            }

            if (!roles.roles.includes(role.id)) {
                return interaction.reply({ content: "This role is not added.", ephemeral: true })
            }

            const index = roles.roles.indexOf(role.id)
            roles.roles.splice(index, 1)

            await db("settings")
                .update({ roles: roles.roles })

            await interaction.reply({ content: "Role removed!", ephemeral: true })
        }
    }
}