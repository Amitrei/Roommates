import express from "express";
import passport from "passport";
const router = express.Router();

// google login
router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(res.cookies);
    res.redirect(process.env.FRONT_END_URL);
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  req.user = {};
  res.redirect("/");
});

router.get("/user", (req, res) => {
  const user = { ...req.user };
  res.status(201).send(user);
});

export default router;
