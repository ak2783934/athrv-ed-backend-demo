const express = require("express");
const app = express();
// const cors = require("cors");

app.use(express.json());
// app.use(cors());

//postgres connection is here
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
const client = pool.connect();

app.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users");
    res.send(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.connect(process.env.PORT, () => {
  console.log("app is running");
});
