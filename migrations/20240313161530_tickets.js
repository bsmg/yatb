exports.up = async function (knex) {
    await knex.schema.createTable("tickets", (table) => {
        table.increments("id").primary();
        table.integer("ticket_id")
        table
            .foreign("ticket_id")
            .references("id")
            .inTable("buttons")
        table.string("user_id").notNullable();
        table.string("category_id").notNullable();
        table.string("status").notNullable();
        table.string("channel_id").notNullable();
        table.string("log_channel_id").notNullable()
        table.string("close_requested_at")
        table.string("closed_by")
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};


exports.down = function (knex) { };