import express from "express";
import { roomService as service } from "./../services/servicesManager.js";
import auth from "../middlewares/auth.js";
import adminPermissions from "../middlewares/adminPermissions.js";
import roomPermissions from "../middlewares/roomPermissions.js";
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;
  body.admin = req.user._id.toString();
  res.send(await service.createRoom(body));
});

// room Details
router.get("/:roomId", [auth, roomPermissions], async (req, res) => {
  res.send(await service.findById(req.params.roomId));
});

router.delete("/:id", [auth, adminPermissions], async (req, res) => {
  res.status(202).send(await service.deleteRoom(req.params.id));
});

// Updating room name
router.put("/:id", [auth, adminPermissions], async (req, res) => {
  res.send(await service.updateRoomName(req.params.id, req.body));
});

// Adding a member
router.post("/:id/members/:memberEmail", [auth, adminPermissions], async (req, res) => {
  const { id, memberEmail } = req.params;
  res.send(await service.addMember(id, memberEmail));
});

// Removing a member
router.delete("/:id/members/:memberId", [auth, adminPermissions], async (req, res) => {
  const { id, memberId } = req.params;
  res.send(await service.removeMember(id, memberId));
});

export default router;
