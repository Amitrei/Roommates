import express from "express";
import "express-async-errors";
import mongoConnection from "./startup/mongoose.js";
import errorHandler from "./middlewares/errorHandler.js";
import transactions from "./routes/transactions.js";
import rooms from "./routes/room.js";
import users from "./routes/user.js";
import auth from "./routes/auth.js";
import cookie from "cookie-session";
import passport from "passport";
import passportConfig from "./config/passport.js";

// Connect to mongo with mongoose
mongoConnection();

//express
const app = express();
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// middlewares

app.use(express.json());
app.use(
  cookie({
    name: "shotafim-session",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth/", auth);
app.use("/api/transactions/", transactions);
app.use("/api/users/", users);
app.use("/api/rooms/", rooms);
app.use(errorHandler);
