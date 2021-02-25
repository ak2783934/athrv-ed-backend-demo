const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

//postgres connection is here
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
const client = pool.connect();

app.get("/db", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM test_table");
    res.json("we are connected ");
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.connect(process.env.PORT, () => {
  console.log("app is running");
});
