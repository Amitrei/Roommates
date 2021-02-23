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

export default router;
