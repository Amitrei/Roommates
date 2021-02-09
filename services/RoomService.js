import EntitiesService from "./EntitiesService.js";
import BadRequest from "./../errors/BadRequest.js";
import excludeProps from "../utils/excludeProps.js";

export default class RoomService extends EntitiesService {
  constructor(roomModel, transactionService, userService) {
    super(roomModel);
    this.transactionService = transactionService;
    this.userService = userService;
  }

  createRoom = async (newRoom) => {
    const excludedRoom = excludeProps(newRoom, "members", "transactions", "totalExpenses");
    const savedRoom = await this.create(excludedRoom);
    return excludedRoom;
  };

  deleteRoom = async (roomId) => {
    const room = await this.findById(roomId);

    // If room found (Error will be throwen if not found), delete also all transactions releated this room.
    room.transactions.forEach(async (t) => await this.transactionService.deleteById(t._id));

    // Reset the roomId property from the members.
    room.members.forEach(async (memberId) => {
      await this.userService.updateById(memberId, { roomId: null });
    });

    const deletedRoom = await this.deleteById(roomId);

    return deletedRoom.name;
  };

  addMember = async (roomId, userId) => {
    const room = await this.findById(roomId);
    const user = await this.userService.findById(userId);

    const isUserAlreadyMember = room.members.filter((m) => m._id.equals(user._id));
    if (isUserAlreadyMember.length)
      throw new BadRequest(`${user.email} is already a member of this room.`);

    // adding the member to the array
    const members = [...room.members, user];
    await this.update(room, { members });

    // assigning the roomId into the specific user model
    await this.userService.update(user, { roomId: room._id });

    return room;
  };

  removeMember = async (roomId, userId) => {
    const room = await this.findById(roomId);
    const user = await this.userService.findById(userId);

    const isUserAlreadyMember = room.members.filter((m) => m._id.equals(user._id));
    if (!isUserAlreadyMember.length)
      throw new BadRequest("This user is not a member of this room.");

    // Removing the user from the room members array
    const members = [...room.members];
    const userIndex = members.findIndex((m) => m._id.equals(userId));
    members.splice(userIndex, 1);

    // Resetting the user roomId property.
    await this.userService.update(user, { roomId: null });

    return await this.update(room, { members });
  };
}
