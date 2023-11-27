const User = require("../models/User.model");
const Cart = require("../models/Cart.model");
const Manager = require("../models/Manager.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerCustomer = async (req, res, next) => {
  try {
    const { user_name, user_email, user_password, user_phone } = req.body;
    // create cart
    const cart = await Cart.create({});
    console.log(cart);
    if (!cart) throw new Error("Unexpected problem on server!");

    // update user with cart id (that received)
    const user = await User.create({
      user_name,
      user_email,
      user_password,
      user_phone,
      user_cart: cart._id,
    });

    if (!user) throw new Error("Unexpected problem on server!");

    return res
      .status(200)
      .json({ success: true, user, message: "user was registreated" });
  } catch (error) {
    next(error);
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    const { user_email, user_password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ user_email });
    if (!user) {
      throw new Error("bad credentials");
    }
    const equal = await bcrypt.compare(user_password, user.user_password);
    if (!equal) {
      throw new Error("bad credentials");
    }

    // user login success
    let payload = { user: user._id };
    const customerToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 30,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // TODO add token to user.tokens in DB (look at user model)
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      { token: refreshToken },
      { new: true }
    );

    // sending refresh token as cookie
    res.cookie("token", refreshToken, {
      httpOnly: true,
      sameSite: "None", // required if domain of api and store/site is different
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "user login successfully - for customer",
      customerToken,
      user: {
        _id: user._id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_cart: user.user_cart,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const foundUser = await User.findById({ _id });
    if (foundUser)
      return res.status(200).send({
        success: true,
        message: "User login successfully - for customer",
        user: {
          _id: foundUser._id,
          user_name: foundUser.user_name,
          user_email: foundUser.user_email,
        },
      });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  console.log('params:', req.params)
  try {
    if (req.params.id === req.user._id) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      console.log("Passed");
      return res
        .status(200)
        .json({
          success: true,
          message: `Successed in updating customer`,
          user,
        });
    } else {
      res.status(401).send({ message: "Unauthorized action" });
    }
  } catch (error) {
    return next(error);
  }
};

const logoutCustomer = async (req, res, next) => {
  // הניתוק משתמש צריך את הטוקן של המשתמש בצד הקליינט
  // במידה והטוקנים הם מסוג ריפרש טוקן אז צריך למחוק אותם מהדאטאבייס

  // קודם נבדוק אם קיים הדר של authorization
  if (req.headers && req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1]; // ['bearer', 'ghfh43$R#!']
      if (!token) {
        return res
          .status(403)
          .send({ success: false, message: "Authorization failed!" });
      }
      const _id = req.user._id;
      // TODO remove token from DB in user document

      res.clearCookie("token");
      return res
        .status(204)
        .send({ success: true, message: "Succesfully logged out." });
    } catch (error) {
      next(error);
    }
  }
};

//* Managers *//

const registerManager = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email is already registered
    const existingManager = await Manager.findOne({ email });

    if (existingManager) {
      return res
        .status(400)
        .json({ message: "Manager with this email already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = new Manager({
      name,
      email,
      password: hashedPassword,
      role: role || "employee", // Default to 'employee' if not provided
    });

    await manager.save();

    res.status(201).json({ message: "Manager registered successfully" });
  } catch (error) {
    next(error);
  }
};

const loginManager = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the manager by email
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(401).json({ message: "Manager not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, manager.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign({ managerId: manager._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const logoutManager = async (req, res, next) => {
  // קודם נבדוק אם קיים הדר של authorization
  if (req.headers && req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1]; // ['bearer', 'ghfh43$R#!']
      if (!token) {
        return res
          .status(403)
          .send({ success: false, message: "Authorization failed!" });
      }
      const _id = req.user._id;
      // TODO remove token from DB in user document

      res.clearCookie("token");
      return res
        .status(204)
        .send({ success: true, message: "Succesfully logged out." });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  updateCustomer,
  registerManager,
  loginManager,
  logoutManager,
  getUserInfo,
};
