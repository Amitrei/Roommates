import { roomService } from "../services/servicesManager.js";

// Admin permissions middleware for the room
export default async (req, res, next) => {
  const { roomId } = req.params;

  const room = await roomService.findById(roomId);

  if (room.admin && req.user && room.admin.equals(req.user._id)) return next();

  return res.status(401).send("you got no permissions");
};
