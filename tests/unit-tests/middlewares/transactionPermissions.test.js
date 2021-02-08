import transactionPermissions from "../../../middlewares/transactionPermissions.js";
import { transactionService } from "../../../services/servicesManager.js";
import { req, res, next } from "./mocks.js";

//mocks
req.transId = 1;
let spyOnTransactionService = jest.spyOn(transactionService, "findById").mockImplementation(() => ({
  madeBy: {
    equals: jest.fn().mockReturnValue(true),
  },
}));

describe("transactionPermissions middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    spyOnTransactionService.mockClear();
  });

  it("Should invoke next() if transaction madeBy is equal to the req.user id", async () => {
    await transactionPermissions(req, res, next);
    expect(next.mock.calls.length).toBe(1);
  });

  it("Should return res status 401 and send a message", async () => {
    spyOnTransactionService = jest.spyOn(transactionService, "findById").mockImplementation(() => ({
      madeBy: {
        equals: jest.fn().mockReturnValue(false),
      },
    }));

    await transactionPermissions(req, res, next);

    expect(res.status.mock.calls.length).toBe(1);
    expect(res.status().send.mock.calls.length).toBe(1);
    expect(res.status.mock.calls[0][0]).toBe(401);
    expect(res.status().send.mock.calls[0][0]).toBe("you got no permissions for this transaction.");
  });
});
