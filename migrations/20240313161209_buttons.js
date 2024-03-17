exports.up = async function (knex) {
    await knex.schema.createTable("buttons", (table) => {
        table.increments("id").primary();
        table.string("label").notNullable();
        table.string("style").notNullable();
        table.string("log_channel_id").notNullable();
        table.string("category_id").notNullable();
        table.string("timeout");
        table.string("emoji");
        table.string("q1"); // Question
        table.boolean("t1"); // Type of question (long or short)
        table.string("q2");
        table.boolean("t2");
        table.string("q3");
        table.boolean("t3");
        table.string("q4");
        table.boolean("t4");
        table.string("q5");
        table.boolean("t5");
    });
};

exports.down = function (knex) { };