const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();
const { MONGO_USR, MONGO_PSW, MONGO_DB } = process.env;
const MONGO_URI = `mongodb+srv://${MONGO_USR}:${MONGO_PSW}@cluster0-fg0dv.gcp.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

// SERVICES

const albert_chat_server = "http://127.0.0.1:5000";

// Mongo connection

console.log(MONGO_URI);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("open", () => {
  console.log("Mongo is connected with Carol");
  console.log(`DB: ${MONGO_DB}`);
});

// middlewares

app.use(cors());
app.use(express.json());

// listeners

app.post("/events", (req, res) => {
  if (req.body) {
    const { type, payload } = req.body;

    // should store the event here

    // EVENT DISPATCHER

    axios.post(albert_chat_server, payload);

    axios;
  }
});

app.listen(process.env.PORT || 3005, () => {
  console.log("Carol is listening on 3005");
});
