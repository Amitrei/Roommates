import EntitiesService from "./../../../services/EntitiesService.js";
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

export const service = new EntitiesService(modelManagerMock(modelMock));
