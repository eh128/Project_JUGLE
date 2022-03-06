const { Pool } = require("pg");

// connection information stored in .env file
const pool = new Pool();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
