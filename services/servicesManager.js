// Managing DI of services

import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Room from "../models/room.js";
import EntitiesService from "./EntitiesService.js";
import RoomService from "./RoomService.js";
import TransactionService from "./TransactionService.js";

const transactionEntity = new EntitiesService(Transaction);
const roomEntitiy = new EntitiesService(Room);
export const userEntity = new EntitiesService(User);

export const roomService = new RoomService(Room, transactionEntity, userEntity);
export const transactionService = new TransactionService(Transaction, userEntity, roomEntitiy);
