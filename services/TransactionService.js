import EntitiesService from "./EntitiesService.js";
import BadRequest from "./../errors/BadRequest.js";

export default class TransactionService extends EntitiesService {
  constructor(transactionModel, userService, roomService) {
    super(transactionModel);
    this.roomService = roomService;
    this.userService = userService;
  }

  // *TODO* - when finishing auth, making sure that user Id is equal to the madeBy id.
  createTransaction = async (transaction) => {
    const room = await this.roomService.findById(transaction.roomId);
    const user = await this.userService.findById(transaction.madeBy);

    if (!room._id.equals(user.roomId)) throw new BadRequest("User isnt a part of this room. ");

    const newTransaction = await this.create(transaction);

    const roomTransactions = [...room.transactions, newTransaction._id];
    const totalExpenses = room.totalExpenses + newTransaction.amount;
    await this.roomService.update(room, { transactions: roomTransactions, totalExpenses });

    return newTransaction;
  };

  // *TODO* - when finishing auth, making sure that user Id is equal to the madeBy id.
  deleteTransaction = async (transactionId) => {
    const transaction = await this.findById(transactionId);
    const room = await this.roomService.findById(transaction.roomId);

    // delete transaction from rooms doc
    const transactionIndex = room.transactions.findIndex((t) => t._id.equals(transaction._id));
    const roomTransactions = [...room.transactions];
    roomTransactions.splice(transactionIndex, 1);

    // revert the total expenses
    const totalExpenses = room.totalExpenses - transaction.amount;
    await this.roomService.update(room, { transactions: roomTransactions, totalExpenses });

    return await this.deleteById(transaction);
  };

  updateTransaction = async (transactionId, updatedTransaction) => {
    const transaction = await this.findById(transactionId);

    if (transaction.amount !== updatedTransaction.amount) {
      const room = await this.roomService.findById(transaction.roomId);
      let totalExpenses = room.totalExpenses - transaction.amount;
      totalExpenses += updatedTransaction.amount;

      await this.roomService.update(room, { totalExpenses });
    }

    return await this.update(transaction, {
      amount: updatedTransaction.amount,
      category: updatedTransaction.category,
    });
  };

  getTransactionsOfUser = async (userId) => {
    return await this.find({ madeBy: userId });
  };

  getTransactionsOfRoom = async (roomId) => {
    return await this.find({ roomId });
  };
}
