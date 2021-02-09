import { roomService } from "../services/servicesManager.js";

// Admin permissions middleware for the room
export default async (req, res, next) => {
  const { id } = req.params;

  const room = await roomService.findById(id);

  if (room.admin && req.user && room.admin.equals(req.user._id)) return next();

  return res.status(401).send("you got no permissions");
};
