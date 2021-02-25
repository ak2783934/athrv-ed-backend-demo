const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//postgres connection is here
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  tls: {
    rejectUnauthorized: false,
  },
});

//running the express app here
app.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const results = { results: result ? result.rows : null };
    res.send(JSON.stringify(results));
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`My app is running at ${port}`);
});
