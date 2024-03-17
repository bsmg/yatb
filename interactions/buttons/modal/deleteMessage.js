module.exports = {
    id: "delete_message",
    async execute(interaction) {
        await interaction.message.delete();
    }
}