const closeRequestEmbed = require("closeRequestEmbed");

module.exports = {
    id: "close_request",
    async execute(interaction) {
        closeRequestEmbed(interaction);
    }
}