const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const paymentRoutes = require("./routes/payment-routes");
const chatRoutes = require("./routes/chat-routes");
const groupRoutes = require("./routes/group-routes");
const HttpError = require("./models/http-error");
const { application } = require("express");

const app = express();

require("dotenv").config();

app.use(bodyParser.json());

var jsonParser = bodyParser.json();

const { OpenAIApi, Configuration } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", jsonParser, async function (req, res) {
  console.log(req.body);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: req.body.data }],
  });
  console.log(completion.data.choices[0].message);
  res.send(completion.data.choices[0].message);
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/groups", groupRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// var cors = require("cors");

mongoose
  .connect(
    `mongodb+srv://mci42:camera109@cluster0.wb05rph.mongodb.net/test?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
