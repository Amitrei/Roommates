import express from "express";
import auth from "../middlewares/auth.js";
import categories from "../models/category.js";
const router = express.Router();

router.get("/", auth, (req, res) => {
  res.send(categories);
});

export default router;
