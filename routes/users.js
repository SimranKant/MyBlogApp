const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const Controller = require("../controllers/comments.js");
const { renderRegisterForm, getLoginForm, login, logout } = require("../controllers/users.js");

router.get("/register", renderRegisterForm);

router.post(
  "/register",
  wrapAsync(User.register)
);

router.get("/login",getLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(login)
);

router.get("/logout",logout);

module.exports = router;
