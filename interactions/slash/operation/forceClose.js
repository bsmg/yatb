const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../../connectDb");
const discordTranscripts = require("discord-html-transcripts");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('force_close')
        .setDescription('Force close a ticket.'),
    async execute(interaction) {
        const channel = interaction.channel;
        const settings = await db("settings")
            .select("*")
            .first();

        if (!channel.name.startsWith("ticket-")) {
            return interaction.reply({ content: "This is not a ticket channel.", ephemeral: true })
        }

        const member = interaction.guild.members.cache.get(interaction.user.id);

        const hasRole = member.roles.cache.some((role) => settings.roles.includes(role.id));

        if (!hasRole) {
            return interaction.reply({ content: "You don't have permission to force close this ticket.", ephemeral: true });
        }

        await interaction.deferReply();

        const transcript = await discordTranscripts.createTranscript(channel, {
            limit: -1,
            filename: `transcript-${channel.name}.html`,
            saveImages: true,
            poweredBy: false,
            ssr: false,
            returnType: "string"
        });

        const transcriptPath = `./temp/${channel.name}.html`;
        fs.writeFileSync(transcriptPath, transcript);

        const ticket = await db("tickets")
            .select("*")
            .where("channel_id", channel.id)
            .first();

        const category = await db("buttons")
            .select("label")
            .where("id", ticket.ticket_id)
            .first();

        const username = (await interaction.guild.members.fetch(ticket.user_id)).user.username;

        const blob = await fs.openAsBlob(transcriptPath);

        const form = new FormData();
        const file = new File([blob], `transcript-${channel.name}.html`, { type: "text/html" });
        form.set("file", file);
        form.set("jsonData", JSON.stringify({ type: category.label, username, ticket: channel.name }));

        await fetch(`${process.env.API_URL}/transcript`, {
            method: "POST",
            headers: {
                Authorization: process.env.AUTH_KEY
            },
            body: form
        });

        fs.unlinkSync(transcriptPath);

        const embed = new EmbedBuilder()
            .setTitle(`Ticket #${ticket.id} closed`)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Ticket closed by ${interaction.user}.`)
            .addFields(
                { name: "Ticket type", value: `${category.label}` },
                { name: "Ticket owner", value: `ID: ${ticket.user_id}` }
            )
            .setColor("Red");

        const logChannel = interaction.guild.channels.cache.get(ticket.log_channel_id);

        logChannel.send({ content: `Transcript available at ${process.env.WEB_URL}/transcript/${channel.name}`, embeds: [embed] });

        interaction.followUp({ content: `Closing this ticket in 5 seconds...` });

        setTimeout(async () => {
            await channel.delete();
            await db("tickets")
                .where("channel_id", channel.id)
                .update({ status: "closed", closed_by: interaction.user.id });
        }, 5000);

    }
}