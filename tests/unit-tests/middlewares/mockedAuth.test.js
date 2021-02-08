import mockedAuth from "../../../middlewares/mockedAuth.js";
import { req, res, next } from "./mocks.js";

//mocks
req.session = {
  user_tmp: { id: 1, name: "mockedUser" },
};

describe("mockedAuth middleware", () => {
  beforeEach(() => {
    delete req.user;
    jest.clearAllMocks();
  });

  it("Should define req.user if req.session && req.session.user_tmp and invoke next()", () => {
    mockedAuth(req, res, next);
    expect(req.user).toMatchObject(req.session.user_tmp);
    expect(next.mock.calls.length).toBe(1);
  });

  it("Shouldnt define req.user if req.session || req.session.user_tmp aint defined", () => {
    delete req.session;
    mockedAuth(req, res, next);
    expect(req.user).toBe(undefined);
    expect(next.mock.calls.length).toBe(1);
  });
});
