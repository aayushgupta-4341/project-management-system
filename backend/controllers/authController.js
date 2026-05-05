const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var SECRET = "mysecretkey123";

function register(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  User.findOne({ email: email })
    .then(function (existing) {
      if (existing) {
        return res.status(400).json({ message: "Email already registered." });
      }

      var hashed = bcrypt.hashSync(password, 10);

      var newUser = new User({
        name: name,
        email: email,
        password: hashed,
      });

      return newUser.save();
    })
    .then(function (saved) {
      if (saved) {
        res.status(201).json({ message: "Account created successfully." });
      }
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
}

function login(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }

  User.findOne({ email: email })
    .then(function (user) {
      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }

      var isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password." });
      }

      var token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1d" });

      res.json({
        token: token,
        name: user.name,
        message: "Login successful.",
      });
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
}

module.exports = { register, login };
