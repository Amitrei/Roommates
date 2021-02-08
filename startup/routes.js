import "express-async-errors";
import express from "express";
import passport from "passport";
import cors from "cors";
import passportConfig from "../config/passport.js";
import errorHandler from "../middlewares/errorHandler.js";
import transactions from "../routes/transactions.js";
import rooms from "../routes/room.js";
import users from "../routes/user.js";
import auth from "../routes/auth.js";
import mockedAuthRoute from "../routes/mockAuthRoute.js";
import mockedAuth from "../middlewares/mockedAuth.js";
import cookie from "cookie-session";

export default (app) => {
  app.use(
    cors({
      origin: "http://localhost:3002",
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

  if (process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "TEST") {
    app.use(mockedAuth);
    app.use("/api/test/auth", mockedAuthRoute);
  }
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/auth/", auth);
  app.use("/api/transactions/", transactions);
  app.use("/api/users/", users);
  app.use("/api/rooms/", rooms);
  app.use(errorHandler);
};
