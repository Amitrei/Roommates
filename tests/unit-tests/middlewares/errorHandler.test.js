import errorHandler from "../../../middlewares/errorHandler.js";
import { req, res, next } from "./mocks.js";
import NotFoundError from "./../../../errors/NotFound.js";
import NoSuchProperty from "./../../../errors/NoSuchProperty.js";
import BadRequest from "./../../../errors/BadRequest.js";
//mocks

describe("errorHandler middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return response status 400 and an err message if error of types NotFound,NoSuchProperty,BadRequest was thrown", () => {
    const errors = [
      new NotFoundError("mockedModel"),
      new NoSuchProperty("mockedModel", "mockedProp"),
      new BadRequest("badRequest mocked"),
    ];

    errors.forEach((error) => {
      jest.clearAllMocks();
      errorHandler(error, req, res, next);
      expect(res.status.mock.calls.length).toBe(1);
      expect(res.status.mock.calls[0][0]).toBe(400);
      expect(res.status().send.mock.calls[0][0]).toBe(error.message);
    });
  });

  it("Should return response status 500 for any other errors then NotFoundError || noSuchProperty || BadRequest", () => {
    errorHandler(new Error("mockedError"), req, res, next);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.status.mock.calls[0][0]).toBe(500);
    expect(res.status().send.mock.calls[0][0]).toBe("something went wrong...");
  });
});
