import EntitiesService from "./EntitiesService.js";
import BadRequest from "./../errors/BadRequest.js";

export default class RoomService extends EntitiesService {
  constructor(roomModel, transactionModel, userModel) {
    super(roomModel);
    this.transactionService = new EntitiesService(transactionModel);
    this.userService = new EntitiesService(userModel);
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
    const room = await this.findById(room);
    // If room found (Error will be throwen if not found), delete also the transactions of this room.
    this.transactionService.deleteByQuery({ roomId: deletedRoom._id });

    // Reset the roomId property from the members.
    room.members.forEach((member) => {
      this.transactionService.updateById(member._id, { roomId: "" });
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
}
