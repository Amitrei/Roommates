import EntitiesService from "../../../services/EntitiesService.js";
import RoomService from "../../../services/RoomService.js";
import TransactionService from "./../../../services/TransactionService.js";
import _ from "lodash";
export const modelManagerMock = (
  model,
  validate = () => ({
    error: undefined,
  })
) => () => ({ model, validate });

export const modelMock = {
  modelName: "model",
  save: jest.fn().mockResolvedValue({ id: 1 }),
  create: jest.fn().mockResolvedValue({ id: 1 }),
  findOne: jest.fn().mockResolvedValue({ id: 1 }),
  find: jest.fn().mockResolvedValue([{ id: 1 }]),
  findById: jest.fn().mockResolvedValue({ id: 1 }),
  findByIdAndDelete: jest.fn().mockResolvedValue({ id: 1 }),
  deleteOne: jest.fn().mockResolvedValue({ id: 1 }),
};

export const serviceMock = {
  create: jest.fn().mockResolvedValue({ id: 1 }),
  findOne: jest.fn().mockResolvedValue({ id: 1 }),
  find: jest.fn().mockResolvedValue([{ id: 1 }]),
  findById: jest.fn().mockResolvedValue({ id: 1 }),
  findAll: jest.fn().mockResolvedValue([{ id: 1 }]),
  deleteById: jest.fn().mockResolvedValue({ id: 1 }),
  deleteByQuery: jest.fn().mockResolvedValue({ id: 1 }),
  updateById: jest.fn().mockResolvedValue({ id: 1 }),
  update: jest.fn().mockResolvedValue({ id: 1 }),
};

export const service = new EntitiesService(modelManagerMock(modelMock));

export const roomService = new RoomService(modelManagerMock(modelMock), serviceMock, serviceMock);

export const userServiceMock = _.cloneDeep(serviceMock);
export const roomServiceMock = _.cloneDeep(serviceMock);

export const transationModelMock = {
  _id: { equals: jest.fn().mockReturnValue(true) },
  roomId: 99,
  madeBy: 22,
  amount: 100,
  category: 1,
  date: Date.now(),
  save: jest.fn().mockReturnValue(true),
};

export const roomModelMock = {
  _id: { equals: jest.fn().mockReturnValue(true) },
  name: "mockedRoom",
  admin: 99,
  members: [{}],
  transactions: [
    { ...transationModelMock },
    { ...transationModelMock },
    { ...transationModelMock },
  ],
  totalExpenses: 0,
};

userServiceMock.findById = jest.fn().mockResolvedValue(roomModelMock);

roomServiceMock.findById = jest.fn().mockResolvedValue(roomModelMock);

export const transactionService = new TransactionService(
  modelManagerMock(modelMock),
  userServiceMock,
  roomServiceMock
);
