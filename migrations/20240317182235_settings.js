exports.up = async function (knex) {
    await knex.schema.createTable("settings", (table) => {
        table.specificType("roles", "text ARRAY");
    });
};

exports.down = function (knex) { };