import express from "express";
import "express-async-errors";
import mongoConnection from "./startup/mongoose.js";
import errorHandler from "./middlewares/errorHandler.js";
import transactions from "./routes/transactions.js";
import rooms from "./routes/room.js";
import users from "./routes/user.js";
// connect to mongo with mongoose
mongoConnection();

//express
const app = express();
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// middlewares
app.use(express.json());
app.use("/api/transactions/", transactions);
app.use("/api/users/", users);
app.use("/api/rooms/", rooms);
app.use(errorHandler);
