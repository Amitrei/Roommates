import { Room } from "../../models/room.js";
export const createRoom = async (adminId) => {
  return await new Room({
    name: "newRoom",
    admin: adminId,
  }).save();
};

export const fakeObjectId = "60134d59bd81d4148246d2d5";
