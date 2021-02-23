import express from "express";
import socketStore from "../services/SocketService.js";
const router = express.Router();

router.post("/", (req, res) => {
  console.error(req.user.email);
  console.log(res.body);
  socketStore[req.user.email] = req.body.socketId;
  res.sendStatus(200);
});

export default router;
