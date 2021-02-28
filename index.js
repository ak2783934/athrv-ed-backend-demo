require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const routes = require("./routes");
//middlewares
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//running the express app here
app.use("/", routes);

app.listen(port, () => {
  console.log(`My app is running at ${port}`);
});
