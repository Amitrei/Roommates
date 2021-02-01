import express from "express";
import passport from "passport";
const router = express.Router();

// google login
router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/api/auth/show");
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/show", (req, res) => {
  res.send(req.user);
});
export default router;

router.get("/user", (req, res) => {
  const user = { ...req.user };
  res.status(201).send(user);
});
