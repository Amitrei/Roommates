import express from "express";
import { Transcation } from "../models/transaction.js";
const router = express.Router();
import { Room } from "../models/room.js";

router.get("/", async (req, res) => {
  const transactions = await Transcation.find();
  res.send(transactions);
});

router.post("/", async ({ body }, res) => {
  const transaction = new Transcation({
    madeBy: body.userId,
    amount: body.amount,
    category: body.category,
    date: Date.now(),
  });

  const results = await transaction.save();
  res.send(results);
});
export default router;
