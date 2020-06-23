const MyDatabase = require("./sourse");

const knexConfig = {
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "",
        database: "course_choose_system"
    }
};

// you can also pass a knex instance instead of a configuration object
const db = new MyDatabase(knexConfig);

module.exports = db;
