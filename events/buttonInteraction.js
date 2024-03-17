const { ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const db = require("../connectDb");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isButton()) return;

		const command = client.buttonCommands.get(interaction.customId);

		if (!command) {
			if (isNaN(Number(interaction.customId))) {
				await require("../messages/defaultButtonError").execute(interaction);
				return;
			}

			const button = await db("buttons")
				.select("*")
				.where("id", interaction.customId)
				.first();

			if (!button) {
				await require("../messages/defaultButtonError").execute(interaction);
				return;
			}

			const questions = []
			if (button.q1) questions.push({ question: button.q1, type: button.t1, number: 1});
			if (button.q2) questions.push({ question: button.q2, type: button.t2, number: 2});
			if (button.q3) questions.push({ question: button.q3, type: button.t3, number: 3});
			if (button.q4) questions.push({ question: button.q4, type: button.t4, number: 4});
			if (button.q5) questions.push({ question: button.q5, type: button.t5, number: 5});

			const modal = new ModalBuilder()
				.setCustomId(interaction.customId)
				.setTitle(button.label)
				.addComponents(
					questions.map((question) => {
						const row = new ActionRowBuilder();
						const input = new TextInputBuilder()
							.setCustomId(question.number.toString())
							.setPlaceholder(question.question)
							.setLabel(question.question)
							.setStyle(TextInputStyle[question.type === true ? "Short" : "Paragraph"])
							.setRequired(true);

						row.addComponents(input);
						return row;
					})
				);

			await interaction.showModal(modal);
			return;
		}

		try {
			await command.execute(interaction);
			return;
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "There was an issue while executing that button!",
				ephemeral: true,
			});
			return;
		}
	},
};
