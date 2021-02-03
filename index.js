import express from "express";
import "express-async-errors";
import mongoConnection from "./startup/mongoose.js";
import routes from "./startup/routes.js";

// Connect to mongo with mongoose
mongoConnection();

//express
const app = express();
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//routes and middlewares
routes(app);
