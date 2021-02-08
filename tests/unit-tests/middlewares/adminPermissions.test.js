import adminPermissions from "../../../middlewares/adminPermissions.js";
import { roomService } from "../../../services/servicesManager.js";
import { req, res, next } from "./mocks.js";

// mocks

let spyOnRoomService = jest.spyOn(roomService, "findById").mockImplementation(() => ({
  admin: {
    equals: jest.fn().mockReturnValue(true),
  },
}));

describe("adminPermissions middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    spyOnRoomService.mockClear();
  });

  it("Should invoke next() if room.admin && req.user && the id's are matched", async () => {
    await adminPermissions(req, res, next);
    expect(next.mock.calls.length).toBe(1);
  });

  it("Should return res.status with status of 401 and a message you got no permissions if user is aint the room admin", async () => {
    spyOnRoomService = jest.spyOn(roomService, "findById").mockImplementation(() => ({
      admin: {
        equals: jest.fn().mockReturnValue(false),
      },
    }));

    await adminPermissions(req, res, next);
    expect(res.status.mock.calls.length).toBe(1);
    expect(res.status().send.mock.calls.length).toBe(1);
    expect(res.status.mock.calls[0][0]).toBe(401);
    expect(res.status().send.mock.calls[0][0]).toBe("you got no permissions");
  });
});
