var express = require("express");
var router = express.Router();
const User = require("../model/userModel");
const passport = require("passport");
const localStrategy = require("passport-local");
const content = require("../model/content");
const budget = require("../model/budget");
passport.use(new localStrategy(User.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { admin: req.user });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function (req, res, next) {}
);

router.get("/about", function (req, res, next) {
  res.render("about", { admin: req.user });
});

router.get("/contact", function (req, res, next) {
  res.render("contact", { admin: req.user });
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { admin: req.user });
});

router.post("/signup", async function (req, res, next) {
  try {
    await User.register(
      {
        username: req.body.username,
        email: req.body.email,
      },
      req.body.password
    ),
      res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

router.get("/forget", function (req, res, next) {
  res.render("forget", { admin: req.user });
});

router.post("/forget", async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res.send("User not found! <a href='/forget'>Try Again</a>.");
    await user.setPassword(req.body.newpassword);
    await user.save();
    res.redirect("/");
  } catch (error) {
    res.send(error);
  }
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const data = await req.user.populate("expenses");
  const exp = data.expenses;
  const total = findtotal(exp);
  console.log(data, exp, total);
  res.render("profile", { admin: req.user, total });
});

router.get("/updateBudget", isLoggedIn, async function (req, res, next) {
  res.render("updateBudget", { admin: req.user });
});
router.post("/updateBudget", isLoggedIn, async function (req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { budget: req.body.budget });
    res.redirect("/profile");
  } catch (error) {
    res.send(error);
  }
});

router.get("/reset", isLoggedIn, function (req, res, next) {
  res.render("reset", { admin: req.user });
});

router.post("/reset", isLoggedIn, async function (req, res, next) {
  try {
    await req.user.changePassword(req.body.oldpassword, req.body.newpassword);
    await req.user.save();
    res.redirect("/profile");
  } catch (error) {
    res.send(error);
  }
});

router.get("/signout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
}

//add items code here
router.get("/addItems", isLoggedIn, function (req, res, next) {
  res.render("addItems", { admin: req.user });
});

router.post("/addItems", isLoggedIn, async function (req, res, next) {
  try {
    const data = new content(req.body);
    req.user.expenses.push(data._id);
    data.user = req.user._id;
    req.user.save();
    await data.save();
    res.redirect("/showItem");
  } catch (error) {
    console.log(error);
  }
});

router.get("/showItem", async function (req, res, next) {
  try {
    // const date = new Date().toLocaleDateString();
    // const data = await req.user.populate("expenses");
    // const exp = data.expenses;

    const data = await req.user.populate("expenses");
    const exp = data.expenses;
    const total = findtotal(exp);
    // console.log(exp)
    res.render("showItem", { admin: req.user, data: exp, total });
  } catch (error) {
    console.log(error);
  }
});

function findtotal(exp) {
  var total = 0;
  exp.forEach((t) => {
    total += t.amount;
  });

  return total;
}

router.get("/delete/:id", async function (req, res, next) {
  try {
    await content.findByIdAndDelete(req.params.id);
    res.redirect("/showItem");
  } catch (error) {
    res.send(error);
  }
});

router.get("/update/:id", async function (req, res, next) {
  let data = await content.findById(req.params.id);
  res.render("update", { admin: req.user, data: data });
});

router.post("/update/:id", async function (req, res, next) {
  try {
    await content.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/showItem");
  } catch (error) {
    res.send(error);
  }
});

router.post("/filter", async function (req, res, next) {
  try {
    console.log(req.body.filter);
    const finddata = await content.findOne({ category: req.body.filter });
    res.render("filter", { admin: req.user, finddata });
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
