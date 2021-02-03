import {
  transactionService,
  userServiceMock,
  roomServiceMock,
  transationModelMock as transactionModelMock,
  roomModelMock,
} from "./mocks.js";
import BadRequest from "./../../../errors/BadRequest.js";

describe("createTransaction", () => {
  beforeEach(async () => {
    await transactionService.createTransaction(transactionModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should invoke the findById of the roomService", async () => {
    expect(roomServiceMock.findById.mock.calls.length).toBe(1);
  });

  it("Should invoke the findById of the userService", async () => {
    expect(userServiceMock.findById.mock.calls.length).toBe(1);
  });

  it("Should throw BadRequest error if user doesnt have the roomId under the roomId prop ", async () => {
    roomModelMock._id.equals = jest.fn().mockReturnValue(false);
    const results = async () => await transactionService.createTransaction(transactionModelMock);

    await expect(results).rejects.toThrow(BadRequest);
    roomModelMock._id.equals = jest.fn().mockReturnValue(true);
  });

  it("Should invoke the create method of the transactionService with the transaction as arg", async () => {
    let spy = jest
      .spyOn(transactionService, "create")
      .mockImplementation(() => transactionModelMock);

    await transactionService.createTransaction(transactionModelMock);

    expect(spy).toHaveBeenCalled();
  });

  it("Should invoke the update method with the updated expenses and transactions of the room", async () => {
    await transactionService.createTransaction(transactionModelMock);
    const expenses = roomModelMock.totalExpenses + transactionModelMock.amount;

    expect(roomServiceMock.update.mock.calls[0][1].transactions.length).toBe(4);
    expect(roomServiceMock.update.mock.calls[0][1].totalExpenses).toBe(expenses);
  });
});

describe("deleteTransaction", () => {
  let spyFindByIdTransactions;
  let spyDeleteByIdTransactions;

  beforeEach(async () => {
    spyFindByIdTransactions = jest
      .spyOn(transactionService, "findById")
      .mockImplementation(() => transactionModelMock);

    spyDeleteByIdTransactions = jest
      .spyOn(transactionService, "deleteById")
      .mockImplementation(() => transactionModelMock);
    await transactionService.deleteTransaction(1);
  });

  afterEach(() => {
    spyFindByIdTransactions.mockRestore();
    jest.clearAllMocks();
  });

  it("Should invoke the findById method of transactionService", async () => {
    expect(spyFindByIdTransactions).toHaveBeenCalled();
  });

  it("Should invoke the findById method of roomService", async () => {
    expect(roomServiceMock.findById).toHaveBeenCalled();
  });

  it("Should invoke the update method of roomService with the updated totalExpenses ", async () => {
    roomModelMock.totalExpenses = 200;
    const updatedExpenses = -1 * (roomModelMock.totalExpenses - transactionModelMock.amount);
    expect(roomServiceMock.update).toHaveBeenCalled();
    expect(roomServiceMock.update.mock.calls[0][1].totalExpenses).toBe(updatedExpenses);
    expect(roomServiceMock.update.mock.calls[0][1].transactions.length).toBe(2);
  });

  it("Should invoke the deleteById of transactionService", async () => {
    expect(spyDeleteByIdTransactions).toHaveBeenCalled();
  });
});

describe("updateTransaction", () => {
  let spyFindByIdTransactions, spyOnUpdate;

  beforeEach(async () => {
    spyOnUpdate = jest
      .spyOn(transactionService, "update")
      .mockImplementation(() => transactionModelMock);

    spyFindByIdTransactions = jest
      .spyOn(transactionService, "findById")
      .mockImplementation(() => transactionModelMock);

    await transactionService.updateTransaction(1, transactionModelMock);
  });

  afterEach(() => {
    spyFindByIdTransactions.mockRestore();
    jest.clearAllMocks();
  });

  it("Should invoke the findById method of the transactionService", async () => {
    expect(spyFindByIdTransactions).toHaveBeenCalled();
  });

  it("Should invoke the roomService findById and update methods if the amount of transasction changes", async () => {
    const updatedTransactionModel = { amount: 999 };

    // Calculating the totalExpenses after the update of transaction.amount
    let totalExpenses = roomModelMock.totalExpenses - transactionModelMock.amount;
    totalExpenses += updatedTransactionModel.amount;

    await transactionService.updateTransaction(1, updatedTransactionModel);
    expect(roomServiceMock.findById).toHaveBeenCalled();
    expect(roomServiceMock.update).toHaveBeenCalled();
    expect(roomServiceMock.update.mock.calls[0][1].totalExpenses).toBe(totalExpenses);
  });

  it("Shouldn't invoke the roomService findById if the amount of transasction are the same", async () => {
    expect(roomServiceMock.findById.mock.calls.length).toBe(0);
  });

  it("Should invoke the update method of the transactionService with the new amount / category", async () => {
    expect(spyOnUpdate).toHaveBeenCalled();
    expect(spyOnUpdate.mock.calls[0][1].amount).toBe(transactionModelMock.amount);
    expect(spyOnUpdate.mock.calls[0][1].category).toBe(transactionModelMock.category);
  });
});

describe("getTransactionsOfUser", () => {
  it("should invoke the find method of the transactionService", async () => {
    let spyOnFind = jest
      .spyOn(transactionService, "find")
      .mockImplementation(() => transactionModelMock);

    await transactionService.getTransactionsOfUser(1);
    expect(spyOnFind).toHaveBeenCalledTimes(1);

    spyOnFind.mockRestore();
  });
});

describe("getTransactionsOfRoom", () => {
  it("should invoke the find method of the transactionService", async () => {
    let spyOnFind = jest
      .spyOn(transactionService, "find")
      .mockImplementation(() => transactionModelMock);

    await transactionService.getTransactionsOfUser(1);
    expect(spyOnFind).toHaveBeenCalledTimes(1);
  });
});
