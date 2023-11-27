const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const costumerToken = req.headers.authorization.split(" ")[1];

    try {
      const payload = jwt.verify(costumerToken, process.env.JWT_SECRET);
      const user = await User.findById(payload._id);

      if (!user) {
        return res
          .status(401)
          .send({ success: false, message: "unauthorized access!" });
      }

      req.user = { _id: payload._id };
      next();
    } catch (error) {
      console.log(error);
      if (error.name === "JsonWebTokenError") {
        return res
          .status(403)
          .send({ success: false, message: "unauthorized access!" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(403).send({
          success: false,
          message: "Token expired try sign in!",
        });
      }

      res
        .status(500)
        .send({ success: false, message: "Internal server error!" });
    }
  } else {
    res.status(401).send({ success: false, message: "Unauthorized access!" });
  }
};
