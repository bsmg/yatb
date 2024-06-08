import { closeRequest } from "../../../helpers/closeRequestEmbed";

module.exports = {
    id: "close_request",
    async execute(interaction) {
        closeRequest(interaction);
    }
}