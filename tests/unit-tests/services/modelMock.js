import EntitiesService from "./../../../services/EntitiesService.js";
import RoomService from "./../../../services/RoomService.js";
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
