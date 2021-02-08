import auth from "../../../middlewares/auth.js";
import { req, res, next } from "./mocks.js";
describe("Auth middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke next() if req.user exists", () => {
    auth(req, res, next);
    expect(next.mock.calls.length).toBe(1);
  });

  it("Should invoke res.status & send if req.user doesnot exists", () => {
    const emptyReq = {};
    auth(emptyReq, res, next);
    expect(res.status.mock.calls.length).toBe(1);
    expect(res.status.mock.calls[0][0]).toBe(401);
    expect(res.status().send.mock.calls.length).toBe(1);
    expect(res.status().send.mock.calls[0][0]).toBe("please log in");
  });
});
