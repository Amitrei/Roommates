import errorHandler from "../middlewares/errorHandler.js";
import transactions from "../routes/transactions.js";
import rooms from "../routes/room.js";
import users from "../routes/user.js";
import auth from "../routes/auth.js";
import express from "express";
import cookie from "cookie-session";
import passport from "passport";
import cors from "cors";
import passportConfig from "../config/passport.js";

export default (app) => {
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
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
};
