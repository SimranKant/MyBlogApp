const User = require("../models/users.js");
module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register.ejs");
};
module.exports.register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to MyBlogApp");
      res.redirect("/blogs");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.getLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to MyBlogApp");
  let redirectUrl = res.locals.redirectUrl || "/blogs";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/blogs");
  });
};
