const db = require("../../../connectDb");

module.exports = {
	name: "ticket",
	async execute(interaction) {
		const focusedValue = interaction.options.getFocused(true);

		if (focusedValue.name === "name" || focusedValue.name === "category") {

			const options = await db("buttons")
				.select("label")

			const choices = options.map((option) => option.label);

			const filtered = choices.filter((choice) =>
				choice.toLowerCase().includes(focusedValue.value.toLowerCase())
			);

			await interaction.respond(
				filtered.map((choice) => ({ name: choice, value: choice }))
			);

			return;
		}

		else {
			const label = interaction.options.getString("category");

			const options = await db("buttons")
				.select("q1", "q2", "q3", "q4", "q5")
				.where("label", label)
				.first();

			const choices = [];

			for (const [key, value] of Object.entries(options)) {
				if (value) {
					choices.push(value.substring(0, 100));
				}
			}

			const filtered = choices.filter((choice) =>
				choice.toLowerCase().includes(focusedValue.value.toLowerCase())
			);

			await interaction.respond(
				filtered.map((choice) => ({ name: choice, value: choice }))
			);

			return;
		}
	},
};
