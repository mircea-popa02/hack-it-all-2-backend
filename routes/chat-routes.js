const express = require("express");
const { check } = require("express-validator");



const chatControllers = require("../controllers/chat-controller");

const router = express.Router();

var bodyParser = require("body-parser");
const request = require("request");
// var cors = require("cors");
var jsonParser = bodyParser.json();

const { OpenAIApi, Configuration } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/", jsonParser, async function (req, res) {
  console.log(req.body);
  res.setHeader("Content-Type", "application/json");
  // res.setHeader("Access-Control-Allow-Origin", "*");
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: req.body.data }],
  });
  //   console.log(completion.data.choices[0].message);
  //   res.send(completion.data.choices[0].message);
});

module.exports = router;
