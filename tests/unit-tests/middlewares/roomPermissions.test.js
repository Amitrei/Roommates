import roomPermissions from "../../../middlewares/roomPermissions.js";
import { req, res, next } from "./mocks.js";

describe("roomPermissions middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke next() if req.user.roomId is eqauls the roomId at the req.params", () => {
    req.user.roomId = 1;
    req.params.roomId = 1;

    roomPermissions(req, res, next);
    expect(next.mock.calls.length).toBe(1);
  });

  it("Should return res.status with 401 and send the message you got no permissions", () => {
    req.user.roomId = 1;
    req.params.roomId = 2;
    roomPermissions(req, res, next);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.status().send.mock.calls.length).toBe(1);
    expect(res.status.mock.calls[0][0]).toBe(401);
    expect(res.status().send.mock.calls[0][0]).toBe("you got no permissions");
  });
});
