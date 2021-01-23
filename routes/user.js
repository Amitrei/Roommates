import express from "express";
import { User } from "../models/user.js";
import EntitiesService from "./../services/EntitiesService.js";
const router = express.Router();
const { findAll, create, findById, update, deleteById } = new EntitiesService(User);

router.get("/", async (req, res) => {
  res.send(await findAll());
});

router.post("/", async (req, res) => {
  const user = {
    name: req.body.name,
    roomId: null,
  };

  res.send(await create(user));
});

router.get("/:id", async (req, res) => {
  const userById = await findById(req.params.id);
  res.send(userById);
});

router.patch("/:id", async (req, res) => {
  const updatedUser = await update(req.params.id, req.body);
  res.send(updatedUser);
});

router.delete("/:id", async (req, res) => {
  res.send(await deleteById(req.params.id));
});
export default router;
