import express from "express";
import { roomService as service } from "./../services/servicesManager.js";
import auth from "../middlewares/auth.js";
import adminPermissions from "../middlewares/adminPermissions.js";
import { toClient } from './../utils/mappers/roomMapper';
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;
  body.admin = req.user._id;
  res.send(await service.createRoom(body));
});

router.delete("/:id", [auth, adminPermissions], async (req, res) => {
  res.send(await service.deleteRoom(req.params.id));
});

// *TODO* - complete this route
router.put("/:id", async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, {});
});

// Adding a member
router.post("/:roomId/members/:memberId", [auth, adminPermissions], async (req, res) => {
  const { roomId, memberId } = req.params;
  console.log(roomId, memberId);
  res.send(await service.addMember(roomId, memberId));
});

// Removing a member
router.delete("/:roomId/members/:memberId", [auth, adminPermissions], async (req, res) => {
  const { roomId, memberId } = req.params;
  res.send(await service.removeMember(roomId, memberId));
});

export default router;
