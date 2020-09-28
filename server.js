const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();
const { MONGO_USR, MONGO_PSW, MONGO_DB } = process.env;
const MONGO_URI = `mongodb+srv://${MONGO_USR}:${MONGO_PSW}@cluster0-fg0dv.gcp.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

// SERVICES

const chat_server = "http://127.0.0.1:5000";
const albert_auth_server = "http://127.0.0.1:3003";
const isaac_query_server = "http://127.0.0.1:3002";

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

app.post(`/events`, async (req, res) => {
  if (req.body) {
    const event = req.body;

    // should store the event here
    console.log("payload received: ", event);

    // EVENT DISPATCHER
    console.log("dispatching");
    try {
      const res = await axios.post(`${albert_auth_server}/events`, event);
      console.log(res.data);
    } catch (err) {
      console.log("ALBERT didnt receive the event => ", event);
      console.log(err.response.data);
    }
    try {
      const res = await axios.post(`${chat_server}/events`, event);
      console.log(res.data);
    } catch (err) {
      console.log("chat server didnt receive the event => ", event);
      console.log(err.response.data);
    }
    try {
      const res = await axios.post(`${isaac_query_server}/events`, event);
      console.log(res.data);
    } catch (err) {
      console.log("Isaac didnt receive the event => ", event);
      console.log(err.response.data);
    }
    res.status(200).json({ status: "ok" });
  }
});

app.listen(process.env.PORT || 3005, () => {
  console.log("Carol is listening on 3005");
});
