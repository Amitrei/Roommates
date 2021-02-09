import express from "express";
import mongoConnection from "./startup/mongoose.js";
import routes from "./startup/routes.js";
import "express-async-errors";

// Connect to mongo with mongoose
mongoConnection();

//express
const app = express();
const port = process.env.PORT || 3002;

export default app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//routes and middlewares
routes(app);

console.log(process.env.NODE_ENV);
