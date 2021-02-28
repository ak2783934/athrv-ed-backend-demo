require("dotenv").config();
const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { isAdmin, isSignedIn } = require("./middleware");

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
    // console.log(name, age, phone, email, college, eventno);
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
router.param("userId", async (req, res, next, id) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE uid=$1", [id]);
    req.profile = result.rows[0];
    next();
  } catch (err) {
    console.error(err);
  }
});

router.post("/postevent/:userId", isSignedIn, isAdmin, async (req, res) => {
  try {
    const userId = req.params;
    // console.log(userId);
    const { name, date } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO event (name,date) VALUES ($1,$2) RETURNING *",
      [name, date]
    );
    // console.log(result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//! signup {it is complete}
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name, email, password);
    //here we have to encypt the password so that it doesn't go in directly
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(password, salt);

    // console.log(newpassword);

    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, newpassword]
    );
    // console.log(result);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//! signin {it is complete here}

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    // console.log(result);
    //if result==null then user doen't exist at all here
    if (result.rows.length === 0) {
      res.json("No user Exist with this email");
    } else {
      //main work will happen here
      bcrypt.compare(password, result.rows[0].password, function (
        err,
        isMatch
      ) {
        if (err) return console.error(err);
        if (isMatch === true) {
          const { name, email, uid } = result.rows[0];
          const token = jwt.sign({ uid }, process.env.secret);
          res.cookie("tkn", token, { expire: new Date() + 9999 });
          res.json({ token, user: { name, email, uid } });
        } else {
          res.json("Email and password didn't match");
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/signout", (req, res) => {
  res.clearCookie("tkn");
  res.json({
    message: "User signed out!",
  });
});

//?put routes
//! only to change the state of the event from active to inactive {auth is required here and eventno is needed }
router.put(
  "/eventedit/:userId/:eventno",
  isSignedIn,
  isAdmin,
  async (req, res) => {
    try {
      const client = await pool.connect();
      const eid = req.params.eventno;
      //now find the thing from eid here no?
      // console.log("before query");
      const event = await client.query("SELECT * FROM event WHERE eid=$1", [
        eid,
      ]);
      const { name, isactive } = event.rows[0];
      // console.log(name, isactive, eid);
      var active = isactive;
      if (active === true) {
        active = false;
        // console.log("True wala ");
      } else {
        active = true;
        // console.log("False wala ");
      }

      const result = await client.query(
        "UPDATE event SET isactive =$1 WHERE eid =$2 RETURNING *",
        [active, eid]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
    }
  }
);

//list all the routes you are going to work on!!
//? get routes
//! 1) getall the events {no auth required} //will be used both inside and outside
router.get("/events", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM event");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

//! 2) get all the persons list registered at certain event {auth required and eventno}
router.get(
  "/getlist/:userId/:eventno",
  isSignedIn,
  isAdmin,
  async (req, res) => {
    try {
      const eventno = req.params.eventno;
      // console.log(eventno);
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM registrations WHERE eventno=$1",
        [eventno]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }
);

module.exports = router;
