const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/databaseHelper");
const apiRouter = require("./router/index");
const customErrorHandler = require("./middlewares/errors/customErrorHandling");
const path = require('path');

dotenv.config({
  path: "./config/env/config.env",
});
 
connectDatabase();

const app = express();

app.use(express.json());
 
app.use("/api", apiRouter);
app.use(customErrorHandler);


app.use(express.static(path.join(__dirname+"/public")))

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
