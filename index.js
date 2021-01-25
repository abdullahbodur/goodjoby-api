const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/databaseHelper");
const apiRouter = require("./router/index");
const customErrorHandler = require("./middlewares/errors/customErrorHandling");
const path = require("path");
const accessControlMiddleware = require("./middlewares/protocolMiddlewares.js/protocolMiddleware");

dotenv.config({
  path: "./config/env/config.env",
});

connectDatabase();

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.use(accessControlMiddleware);

app.use("/api", apiRouter);

app.use(customErrorHandler);

app.use(express.static(path.join(__dirname + "/public")));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
