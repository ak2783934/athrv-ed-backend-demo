const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
//postgres connection is here
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  tls: {
    rejectUnauthorized: false,
  },
});

//?post routes
//! putting the name in the list in the front page {no auth required here}

router.post("/registration", async (req, res) => {
  try {
    const { name, age, phone, email, college, eventno } = req.body;
    console.log(name, age, phone, email, college, eventno);
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO registrations (name,age,phone,email,college,eventno) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, age, phone, email, college, eventno]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//! posting a new event {auth required here}
//? FIRST WE WILL MAKE IT NOT AUTH REQUIRED
router.post("/postevent", async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO event (name) VALUES ($1) RETURNING *",
      [name]
    );
    console.log(result);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//! signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    //here we have to encypt the password so that it doesn't go in directly

    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(password, salt);

    console.log(newpassword);

    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    console.log(result);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//! signin

//?delete routes
//! nowhere use at all

//?put routes
//! only to change the state of the event from active to inactive {auth is required here }

//list all the routes you are going to work on!!
//? get routes
//! 1) getall the events {no auth required} //will be used both inside and outside

//! 2) get all the persons list registered at certain event {auth required}
//! 3)

//try route

router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const results = { results: result ? result.rows : null };
    res.send(JSON.stringify(results));
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
