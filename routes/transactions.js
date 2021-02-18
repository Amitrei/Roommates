import express from "express";
const router = express.Router();
import { transactionService as service } from "../services/servicesManager.js";
import { fromClient } from "../utils/mappers/transactionMapper.js";
import auth from "../middlewares/auth.js";
import roomPermissions from "../middlewares/roomPermissions.js";
import transactionPermissions from "../middlewares/transactionPermissions.js";

// router.get("/", async (req, res) => {
//   res.send(await service.findAll());
// });

router.post("/:roomId", [auth, roomPermissions], async (req, res) => {
  const { body, user, params } = req;
  const dto = fromClient(body, user, params.roomId);
  res.send(await service.createTransaction(dto));
});

router.delete("/:roomId/:transId", [auth, transactionPermissions], async (req, res) => {
  res.status(202).send(await service.deleteTransaction(req.params.transId));
});

router.patch("/:transId", [auth, transactionPermissions], async (req, res) => {
  const dto = fromClient(req.body, req.user);
  res.send(await service.updateTransaction(req.params.transId, dto));
});

router.get("/user", auth, async (req, res) => {
  res.send(await service.getTransactionsOfUser(req.user._id));
});

router.get("/room/:roomId", [auth, roomPermissions], async (req, res) => {
  res.send(await service.getTransactionsOfRoom(req.params.roomId));
});

export default router;
