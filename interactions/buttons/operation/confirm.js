const { EmbedBuilder } = require("discord.js");
const db = require("../../../connectDb");
const discordTranscripts = require("discord-html-transcripts");
const { FormData, File } = require("formdata-node");
const fs = require("fs");

module.exports = {
    id: "confirm_close",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.channel;
        const footer = interaction.message.embeds[0].footer.text;

        if (footer.startsWith("Wait for")) {
            const settings = await db("settings")
                .select("roles")
                .first();

            const member = interaction.guild.members.cache.get(interaction.user.id);

            const hasRole = member.roles.cache.some((role) => settings.roles.includes(role.id));

            if (!hasRole) {
                return interaction.followUp({ content: "You do not have permission to close this ticket.", ephemeral: true });
            }
        }

        else {
            if (interaction.user.id !== footer.split(" | ")[0]) {
                return interaction.followUp({ content: "You do not have permission to close this ticket.", ephemeral: true });
            }
        }

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

        const logChannel = interaction.guild.channels.cache.get(ticket.log_channel_id);

        const embed = new EmbedBuilder()
            .setTitle(`Ticket #${ticket.id} closed`)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Ticket closed by ${interaction.user}.`)
            .addFields(
                { name: "Ticket type", value: `${category.label}` },
                { name: "Ticket owner", value: `ID: ${ticket.user_id}` }
            )
            .setColor("Red")

        logChannel.send({ content: `Transcript available at ${process.env.WEB_URL}/transcript/${channel.name}`, embeds: [embed] });

        interaction.followUp({ content: `Close Request Confirmed!` })
        interaction.followUp({ content: `Closing this ticket in 5 seconds...`, ephemeral: false });

        setTimeout(async () => {
            await channel.delete();
            await db("tickets")
                .where("channel_id", channel.id)
                .update({ status: "closed", closed_by: footer.startsWith("Wait for") ? interaction.user.id : footer.split(" | ")[1] });
        }, 5000);
    }
}