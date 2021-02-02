import EntitiesService from "./../../../services/EntitiesService.js";
import { modelMock, modelManagerMock, service } from "./modelMock.js";
import ValidationError from "./../../../errors/ValidationError.js";
import NotFoundError from "./../../../errors/NotFound.js";
import NoSuchProperty from "./../../../errors/NoSuchProperty.js";

describe("create", () => {
  it("Should throw an ValidationError if model aint valid", async () => {
    const validationErrorMock = (model) => ({
      error: {
        details: [{ message: "a mocked error" }],
      },
    });

    const model = modelManagerMock(modelMock, validationErrorMock);
    const service = new EntitiesService(model);

    const results = async () => {
      await service.create("mockedModel");
    };

    expect(results).rejects.toThrow(ValidationError);
  });

  it("Should invoke create function of model", async () => {
    const modelManager = modelManagerMock(modelMock);
    await new EntitiesService(modelManager).create({ id: 1 });

    expect(modelMock.create.mock.calls.length).toBe(1);
  });
});

describe("findOne", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should uses selectors if they are passed as argument", async () => {
    const modelManager = modelManagerMock(modelMock);
    await new EntitiesService(modelManager).findOne({}, "s1", "s2");

    expect(modelMock.findOne.mock.calls[0][1]).toBe("s1 s2");
  });

  it("Should use only the query argument if non selectors are passed as args", async () => {
    const modelManager = modelManagerMock(modelMock);
    await new EntitiesService(modelManager).findOne({});
    expect(modelMock.findOne.mock.calls[0][1]).toBe(undefined);
  });

  it("Should throw an NotFoundError if a model wasnt found", async () => {
    modelMock.findOne = jest.fn().mockResolvedValue(null);
    const modelManager = modelManagerMock(modelMock);
    const results = async () => await new EntitiesService(modelManager).findOne({});
    expect(results).rejects.toThrow(NotFoundError);
  });

  it("Should return the model that was found", async () => {
    modelMock.findOne = jest.fn().mockResolvedValue({ id: "1", name: "mockedName" });
    const modelManager = modelManagerMock(modelMock);
    const results = await new EntitiesService(modelManager).findOne({});

    expect(results).toBe(await modelMock.findOne());
  });
});

describe("find", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should invoke the find method of the model", async () => {
    const modelManager = modelManagerMock(modelMock);
    await new EntitiesService(modelManager).find({ id: 1 });

    expect(modelMock.find.mock.calls.length).toBe(1);
  });
});

describe("findById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the findById method of the model", async () => {
    const modelManager = modelManagerMock(modelMock);
    await new EntitiesService(modelManager).findById({ id: 1 });

    expect(modelMock.findById.mock.calls.length).toBe(1);
  });

  it("Should throw a notFoundError if model was not found", async () => {
    modelMock.findById = jest.fn().mockResolvedValue(null);
    const modelManager = modelManagerMock(modelMock);
    const results = async () => await new EntitiesService(modelManager).findById({});
    expect(results).rejects.toThrow(NotFoundError);
  });

  it("Should return the model if model was found", async () => {
    modelMock.findById = jest.fn().mockResolvedValue({ id: "1", name: "mockedName" });
    const modelManager = modelManagerMock(modelMock);
    const results = await new EntitiesService(modelManager).findById({});

    expect(results).toBe(await modelMock.findById());
  });
});

describe("findAll", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should invoke the find method of the model", async () => {
    const modelManager = modelManagerMock(modelMock);
    await new EntitiesService(modelManager).findAll({ id: 1 });

    expect(modelMock.find.mock.calls.length).toBe(1);
  });
});

describe("deleteById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the findByIdAndDelete method of model", async () => {
    await service.deleteById(1);
    expect(modelMock.findByIdAndDelete.mock.calls.length).toBe(1);
  });

  it("Should throw notFoundError if model wasnt found", async () => {
    modelMock.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const results = async () => await service.deleteById(1);
    expect(results).rejects.toThrow(NotFoundError);
  });

  it("Should return the model if model was found", async () => {
    modelMock.findByIdAndDelete = jest.fn().mockResolvedValue({ id: "1", name: "mockedName" });
    const results = await service.deleteById(1);

    expect(results).toEqual(await modelMock.findByIdAndDelete());
  });
});

describe("deleteByQuery", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the deleteOne method of the model", async () => {
    await service.deleteByQuery({});
    expect(modelMock.deleteOne.mock.calls.length).toBe(1);
  });

  it("Should throw an NotFoundError if model wasnt found", async () => {
    modelMock.deleteOne = jest.fn().mockResolvedValue(null);
    const results = async () => await service.deleteByQuery({});
    expect(results).rejects.toThrow(NotFoundError);
  });

  it("Should return the deleted object", async () => {
    modelMock.deleteOne = jest.fn().mockResolvedValue({ id: 1, name: "mockedModel" });
    const results = await service.deleteByQuery({});
    expect(results).toEqual(await modelMock.deleteOne());
  });
});

describe("updateById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the findById method of model", async () => {
    modelMock.findById = jest.fn().mockResolvedValue({
      id: 1,
      name: "mockedModel",
      save: jest.fn().mockResolvedValue({ id: 1, name: "mockedModel" }),
    });
    await service.updateById(1, { id: 1 });
    expect(modelMock.findById.mock.calls.length).toBe(1);
  });

  it("Should throw notFoundError if model was not found", async () => {
    modelMock.findById = jest.fn().mockResolvedValue(null);
    const results = async () => await service.updateById(1, {});
    expect(results).rejects.toThrow(NotFoundError);
  });

  it("Should throw NoSuchProperty error if the updateRequest props does not match the model props.", async () => {
    modelMock.findById = jest.fn().mockResolvedValue({
      id: 1,
      name: "mockedModel",
      save: jest.fn().mockResolvedValue({ id: 1, name: "mockedModel" }),
    });

    const results = async () => await service.updateById(1, { badProp: 1 });
    expect(results).rejects.toThrow(NoSuchProperty);
  });

  it("Should update model props if the updateRequest props are matched", async () => {
    modelMock.findById = jest.fn().mockResolvedValue({
      id: 1,
      name: "mockedModel",
      save: jest.fn().mockResolvedValue({ id: 1, name: "mockedModel" }),
    });

    await service.updateById(1, { id: 2 });
    const { id } = await modelMock.findById();
    expect(id).toBe(2);
  });

  it("Should invoke the save method of the model", async () => {
    await service.updateById(1, {});
    const { save } = await modelMock.findById();
    expect(save.mock.calls.length).toBe(1);
  });
});

describe("update", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should throw NoSuchProperty error if the updateRequest props does not match the model props", async () => {
    const model = { id: 1, name: "mockedName" };
    const results = async () => await service.update(model, { badProp: true });

    expect(results).rejects.toThrow(NoSuchProperty);
  });

  it("Should update the props that found matched in the updateRequest", async () => {
    const model = { id: 1, name: "mockedModel", save: jest.fn().mockResolvedValue("saved") };
    await service.update(model, { id: 99 });
    expect(model.id).toBe(99);
  });

  it("Should invoke the save method of the model", async () => {
    const model = { id: 1, name: "mockedModel", save: jest.fn().mockResolvedValue("saved") };
    await service.update(model, { id: 99 });

    expect(model.save.mock.calls.length).toBe(1);
  });
});
