import EntitiesService from "./EntitiesService.js";
import BadRequest from "./../errors/BadRequest.js";

export default class RoomService extends EntitiesService {
  constructor(roomModel, transactionService, userService) {
    super(roomModel);
    this.transactionService = transactionService;
    this.userService = userService;
  }

  createRoom = async (newRoom) => {
    // Creating empty room and creating empty transactions
    const room = await this.create(newRoom);

    // Creating empty transactions and assigning the roomId
    if (room) {
      await this.transactionService.create({ roomId: room._id });
    }

    return room;
  };

  deleteRoom = async (roomId) => {
    const room = await this.findById(roomId);
    // If room found (Error will be throwen if not found), delete also the transactions of this room.
    await this.transactionService.deleteByQuery({ roomId: room._id });

    // Reset the roomId property from the members.
    room.members.forEach(async (memberId) => {
      await this.userService.updateById(memberId, { roomId: null });
    });

    const deletedRoom = await this.deleteById(roomId);

    return deletedRoom;
  };

  addMember = async (roomId, userId) => {
    const room = await this.findById(roomId);
    const user = await this.userService.findById(userId);

    const isUserAlreadyMember = room.members.filter((m) => m._id.equals(user._id));
    if (isUserAlreadyMember.length)
      throw new BadRequest(`${user.name} is already a member of this room.`);

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
