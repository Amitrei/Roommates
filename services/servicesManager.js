// Managing DI from services

import { User } from "../models/user.js";
import { Transaction } from "../models/transaction.js";
import { Room } from "../models/room.js";
import EntitiesService from "./EntitiesService.js";
import RoomService from "./RoomService.js";
import TransactionService from "./TransactionService.js";

const userService = new EntitiesService(User);
const transactionEntity = new EntitiesService(Transaction);
const roomEntitiy = new EntitiesService(Room);

export const roomService = new RoomService(Room, transactionEntity, userService);
export const transactionService = new TransactionService(Transaction, userService, roomEntitiy);
