import express from "express";
import { roomService as service } from "./../services/servicesManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await service.findAll();
  res.send(rooms);
});

router.post("/", async (req, res) => {
  const { body } = req;
  res.send(await service.createRoom(body));
});

router.delete("/:id", async (req, res) => {
  res.send(await service.deleteRoom(req.params.id));
});

// *TODO* - complete this route
router.put("/:id", async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, {});
});

// Adding a member
router.post("/:roomId/members/:memberId", async (req, res) => {
  const { roomId, memberId } = req.params;
  res.send(await service.addMember(roomId, memberId));
});

// Removing a user
router.delete("/:roomId/members/:memberId", async (req, res) => {
  const { roomId, memberId } = req.params;
  res.send(await service.removeMember(roomId, memberId));
 });

export default router;
