import express from "express";
import auth from "../middlewares/auth.js";
import { notifcationService } from "../services/servicesManager.js";
const router = express.Router();

// Get all user notifications
router.get("/", auth, async (req, res) => {
  const notifications = await notifcationService.find({ sentTo: req.user._id });
  if (notifications.length) {
    return res.send(notifications);
  }
});

router.delete("/:id", auth, async (req, res) => {
res.send(await notifcationService.deleteById(req.params.id))
});

export default router;
