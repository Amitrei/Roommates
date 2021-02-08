import express from "express";
const router = express.Router();

const fakeUser = {
  _id: "60134d59bd81d4148296d3d3",
  email: "mockedUser@gmail.com",
  googleId: 99999,
  roomId: "60102ba3f7e1631e277d3aa6",
  profilePicture: "http://www.google.com",
};

router.get("/", (req, res) => {
  if (!req.session) {
    req.session = {};
  }
  req.session.user_tmp = fakeUser;
  res.send(req.session.user);
});

export default router;
