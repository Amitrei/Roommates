import express from "express";
import { Room } from "../models/room.js";
import { Transcation as RoomTransactions } from "../models/transaction.js";
import { User } from "../models/user.js";
import RoomService from "./../services/RoomService.js";

const service = new RoomService(Room, RoomTransactions, User);
const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find();
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

export default router;
