import { modelMock, serviceMock, roomService, service } from "./mocks.js";
import BadRequest from "./../../../errors/BadRequest.js";

describe("createRoom", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should exclude default props of model if exists", async () => {
    modelMock.members = ["mock1", "mock2", "mock3"];
    modelMock.transactions = ["mock1", "mock2", "mock3"];
    modelMock.totalExpenses = 999;
    modelMock.admin = "124214124sfsdf314";

    const results = await roomService.createRoom(modelMock);

    expect(results.members).toBe(undefined);
    expect(results.transactions).toBe(undefined);
    expect(results.totalExpenses).toBe(undefined);
    expect(results.admin).toBe(undefined);
  });

  it("Should invoke the create method of the room model", async () => {
    await roomService.createRoom({});
    expect(modelMock.create.mock.calls.length).toBe(1);
  });

  it("Should return the model", async () => {
    const model = await modelMock.create();
    const results = await roomService.create(model);
    expect(results).toEqual(model);
  });
});

describe("deleteRoom", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the findById method of the model", async () => {
    modelMock.findById = jest.fn().mockResolvedValue({
      transactions: [{ _id: 999, name: "mockedName" }],
      members: ["memberIdMocked999"],
    });
    await roomService.deleteRoom(999);
    expect(modelMock.findById.mock.calls.length).toBe(1);
  });

  it("Should iterate over all transactions and invoke the deleteById method of the service", async () => {
    modelMock.findById = jest.fn().mockResolvedValue({
      transactions: [
        { _id: 999, name: "mockedName1" },
        { _id: 555, name: "mockedName2" },
        { _id: 222, name: "mockedName3" },
      ],
      members: ["memberIdMocked999"],
    });

    await roomService.deleteRoom(999);

    expect(serviceMock.deleteById.mock.calls.length).toBe(3);
  });

  it("Should iterate over all members of the room and invoke the updateById method of service", async () => {
    modelMock.findById = jest.fn().mockResolvedValue({
      transactions: [],
      members: ["memberIdMocked999", "memberIdMocked222", "memberIdMocked111"],
    });

    await roomService.deleteRoom(999);
    expect(serviceMock.updateById.mock.calls.length).toBe(3);
  });

  it("Should invoke the deleteById method of the model", async () => {
    let spy = jest.spyOn(roomService, "deleteById");
    await roomService.deleteRoom(999);
    expect(spy).toHaveBeenCalled();
  });

  it("Should return the deletedById results", async () => {
    const model = { id: 1, name: "mockedName" };
    let spy = jest.spyOn(roomService, "deleteById").mockImplementation(() => model);
    const results = await roomService.deleteRoom(999);
    expect(results).toEqual(model);

    spy.mockRestore();
  });
});

describe("addMember", () => {
  let findByIdSpy, serviceUpdateSpy, roomServiceUpdateSpy;

  beforeEach(async () => {
    roomServiceUpdateSpy = jest.spyOn(roomService, "update").mockImplementation(() => ({}));
    serviceUpdateSpy = jest.spyOn(serviceMock, "update").mockImplementation(() => ({}));
    findByIdSpy = jest.spyOn(roomService, "findById").mockImplementation(() => ({
      id: 1,
      members: [
        { _id: { equals: jest.fn().mockReturnValue(false) } },
        { _id: { equals: jest.fn().mockReturnValue(false) } },
        { _id: { equals: jest.fn().mockReturnValue(false) } },
      ],
    }));

    await roomService.addMember(1, 1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the findById method of the roomService", async () => {
    expect(findByIdSpy).toHaveBeenCalled();
  });

  it("Should invoke the findById method of the user Service", async () => {
    expect(serviceMock.findById.mock.calls.length).toBe(1);
  });

  it("Should throw a badRequest error if user already a member of the room", async () => {
    // findById will return a room model with members list that one of them will return true for equals func.
    jest.spyOn(roomService, "findById").mockImplementation(() => ({
      id: 1,
      members: [
        { _id: { equals: jest.fn().mockReturnValue(false) } },
        { _id: { equals: jest.fn().mockReturnValue(true) } },
        { _id: { equals: jest.fn().mockReturnValue(false) } },
      ],
    }));

    const results = roomService.addMember(1, 1);
    expect(results).rejects.toThrow(BadRequest);
  });

  it("Should invoke the update method of the roomService to update the members at db", async () => {
    expect(roomServiceUpdateSpy).toHaveBeenCalled();
  });

  it("Should invoke the update method of userService to update the user user roomId at db", async () => {
    expect(serviceUpdateSpy).toHaveBeenCalled();
  });

  it("Should return the room after added member", async () => {
    const results = await roomService.addMember(1, 1);
    const service = roomService.findById();
    expect(results.id).toBe(service.id);
  });
});

describe("removeMember", () => {
  let findByIdSpy, serviceUpdateSpy, roomServiceUpdateSpy;
  beforeEach(async () => {
    roomServiceUpdateSpy = jest.spyOn(roomService, "update").mockImplementation(() => ({}));
    serviceUpdateSpy = jest.spyOn(serviceMock, "update").mockImplementation(() => ({}));
    findByIdSpy = jest.spyOn(roomService, "findById").mockImplementation(() => ({
      id: 1,
      members: [
        { _id: { equals: jest.fn().mockReturnValue(false) } },
        { _id: { equals: jest.fn().mockReturnValue(true) } },
        { _id: { equals: jest.fn().mockReturnValue(false) } },
      ],
    }));

    await roomService.removeMember(1, 1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the findById method of the roomService", async () => {
    expect(findByIdSpy).toHaveBeenCalled();
  });

  it("Should invoke the findById method of the userService", async () => {
    expect(serviceMock.findById.mock.calls.length).toBe(1);
  });

  it("Should throw an BadRequest error if user is not a member of this room", async () => {
    // all equals are false -> will throw BadRequest error no user was found
    findByIdSpy = jest.spyOn(roomService, "findById").mockImplementation(() => ({
      id: 1,
      members: [
        { _id: { equals: jest.fn().mockReturnValue(false) } },
        { _id: { equals: jest.fn().mockReturnValue(false) } },
        { _id: { equals: jest.fn().mockReturnValue(false) } },
      ],
    }));

    const results = async () => await roomService.removeMember(1, 1);
    expect(results).rejects.toThrow(BadRequest);
  });

  it("Should invoke the update method of the user service inorder to reset roomId prop", async () => {
    expect(serviceUpdateSpy).toHaveBeenCalled();
  });

  it("Should have removed the member from the members array", async () => {
    expect(roomServiceUpdateSpy.mock.calls[0][1].members.length).toBe(2);
  });

  it("Should invoke the update method of the roomService", async () => {
    expect(roomServiceUpdateSpy).toHaveBeenCalled();
  });
});
