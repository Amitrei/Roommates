import express from "express";
const router = express.Router();
import { userEntity as service } from "../services/servicesManager.js";
const { findAll, create, findById, update, deleteById } = service;

router.get("/", async (req, res) => {
  res.send(await findAll());
});

router.post("/", async (req, res) => {
  res.send(await create(req.body));
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
