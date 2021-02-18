import express from "express";
const router = express.Router();
import { User } from "../models/user.js";
const fakeUser = {
  _id: "60134d59bd81d4148296d3d3",
  email: "mockedUser@gmail.com",
  googleId: 99999,
  roomId: "60102ba3f7e1631e277d3aa6",
  profilePicture: "http://www.google.com",
};

router.get("/", async (req, res) => {
  if (!req.session) {
    req.session = {};
  }

  let mockedUserInDB = await User.findOne({ email: fakeUser.email });
  if (!mockedUserInDB) {
    mockedUserInDB = await new User({ email: fakeUser.email, googleId: fakeUser.googleId }).save();
  }
  req.session.user_tmp = mockedUserInDB;
  res.send(req.session.user);
});


router.get("/user", (req, res) => {
  return req.user ? res.send(req.user) : "no session has found";
});

export default router;