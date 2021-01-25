import express from "express";
import { transactionService as service } from "../services/servicesManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await service.findAll());
});

router.post("/:roomId", async (req, res) => {
  const { body } = req;
  const userId = "600ebfa415be7f32ec87c6a2";
  body.madeBy = userId;
  body.roomId = req.params.roomId;
  res.send(await service.createTransaction(body));
});

router.delete("/:roomId/:transId", async (req, res) => {
  const { body, params } = req;
  const userId = "600c3c9a7816d52c8bec3c6e";
  body.madeBy = userId;
  body.roomId = params.roomId;
  res.send(await service.deleteTransaction(params.transId));
});

router.patch("/:transId", async (req, res) => {
  res.send(await service.updateTransaction(req.params.transId, req.body));
});

router.get("/user/:userId", async (req, res) => {
  res.send(await service.getTransactionsOfUser(req.params.userId));
});

router.get("/room/:roomId", async (req, res) => {
  res.send(await service.getTransactionsOfRoom(req.params.roomId));
});

export default router;
