const User = require("../model/User");
const jwt = require("jsonwebtoken");
  const handleErrors = (err) => {
    console.log(err.message);
    // console.log(err.code);
    // err.code is for duplicate exists
    let error = { email: "", password: "" };
    if (err.code === 11000) {
      error.email = "email already in use";
      return error;
    }
    if (err.message.includes("User validation failed")) {
      // to take values only form object
      Object.values(err.errors).forEach(({ properties }) => {
        console.log(properties);
        error[properties.path] = properties.message;
      });
    }
    if (err.message === "incorrect email") {
      error.email = "that email not registered";
    }
    if (err.message === "incorrect password") {
      error.password = "that password is incorrect";
    }
    return error;
  };
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "qwertyuiopasdfghjkl", {
    expiresIn: maxAge,
  });
};
module.exports.signupGet = (req, res) => {
  res.render("signup");
};
module.exports.signupPost = async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await User.create({
      email,
      password,
    });
    const token = createToken(user._id);
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .status(200)
      .json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.loginGet = (req, res) => {
  res.render("login");
};
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .status(200)
      .json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.logoutGet = (req, res) => {
    res.cookie('jwt','',{ maxAge:1}).redirect('/')
}
