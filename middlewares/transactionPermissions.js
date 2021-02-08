import { transactionService } from "../services/servicesManager.js";

// Transaction permissions middleware for the transaction owner
export default async (req, res, next) => {
  const { transId } = req.params;

  const transacation = await transactionService.findById(transId);

  if (transacation && transacation.madeBy.equals(req.user._id)) return next();

  return res.status(401).send("you got no permissions for this transaction.");
};
