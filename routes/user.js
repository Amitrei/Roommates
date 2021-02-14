import express from "express";
const router = express.Router();
import { userEntity as service } from "../services/servicesManager.js";
import auth from "../middlewares/auth.js";

// Not needed at the moment.
// router.get("/", async (req, res) => {
//   res.send(await service.findAll());
// });

router.post("/", async (req, res) => {
  res.send(await service.create(req.body));
});

router.get("/", auth, async (req, res) => {
  const userById = await service.findById(req.user._id);
  res.send(userById);
});

router.patch("/", auth, async (req, res) => {
  const userById = await service.findById(req.user._id);
  const updatedUser = await service.update(userById, req.body);
  res.send(updatedUser);
});

router.delete("/", auth, async (req, res) => {
  res.status(202).send(await service.deleteById(req.user._id));
});
export default router;
