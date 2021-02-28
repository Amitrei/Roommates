import EntitiesService from "./EntitiesService.js";
import BadRequest from "./../errors/BadRequest.js";
import excludeProps from "../utils/excludeProps.js";
import NoSuchProperty from "./../errors/NoSuchProperty.js";
import { notifcationService } from "./servicesManager.js";
import socketStore from "../services/SocketService.js";
import { io } from "../index.js";

export default class RoomService extends EntitiesService {
  constructor(roomModel, transactionService, userService) {
    super(roomModel);
    this.transactionService = transactionService;
    this.userService = userService;
  }

  createRoom = async (newRoom) => {
    const excludedRoom = excludeProps(newRoom, "members", "transactions", "totalExpenses");
    const savedRoom = await this.create(excludedRoom);
    if (savedRoom) {
      // Setting roomID prop on the user to the created room.
      await this.userService.updateById(newRoom.admin, { roomId: savedRoom._id });
    }

    return savedRoom;
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

    return deletedRoom;
  };

  addMember = async (roomId, userEmail) => {
    const room = await this.findById(roomId);
    const user = await this.userService.findOne({ email: userEmail });

    const isUserAlreadyMember = room.members.filter((m) => m._id.equals(user._id));
    if (isUserAlreadyMember.length)
      throw new BadRequest(`${user.email} is already a member of this room.`);

    // adding the member to the array
    const members = [...room.members, user];
    await this.update(room, { members });

    // deleteing invitation
    const inivitIndex = room.invitedMembers.findIndex((member) => member._id === user._id);
    let invitedMembers = [...room.invitedMembers];
    invitedMembers.splice(inivitIndex, 1);
    await this.update(room, { invitedMembers });

    // assigning the roomId into the specific user model
    await this.userService.update(user, { roomId: room._id });

    return room;
  };

  inviteMember = async (roomId, userEmail) => {
    const room = await this.findById(roomId);
    const user = await this.userService.findOne({ email: userEmail });

    // add user to the invited array of room

    if (
      room.invitedMembers.includes(user._id.toString()) ||
      room.members.includes(user._id.toString())
    ) {
      throw new BadRequest("User already invited");
    }

    if (user && room) {
      const invitedMembers = [...room.invitedMembers, user._id];
      await this.update(room, { invitedMembers });
    }

    //create and send notification to user
    const notification = await notifcationService.create({
      type: "memberInvitation",
      content: `You have been invited to join the room ${room.name}`,
      roomId: room._id.toString(),
      roomName: room.name,
      sentTo: user._id.toString(),
    });

    // sending notification using Socket io
    io.to(socketStore[user.email]).emit("notificationRecieved", notification);
  };

  updateRoomName = async (roomId, requestBody) => {
    const room = await this.findById(roomId);
    const { name } = requestBody;
    if (!name) throw new NoSuchProperty("room", "name");
    return await this.update(room, { name });
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

  getAllMembers = async (roomId) => {
    const room = await this.findById(roomId);
    this.userService;
    let detailedMembers = [];
    const members = await this.userService.find({ roomId });
    members.forEach(member => {
      detailedMembers.push({email:member.email,profilePicture:member.profilePicture})
    })
    
    
    
  return detailedMembers;
  };
}
