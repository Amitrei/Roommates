// Managing DI from services 

import {User} from "../models/user.js";
import  { Transcation } from "../models/transaction.js";
import { Room } from "../models/room.js";
import EntitiesService from "./EntitiesService.js";
import RoomService from "./RoomService.js";

const userService = new EntitiesService(User);
const transactionService = new EntitiesService(Transcation);
export const roomService = new RoomService(Room, transactionService, userService);
