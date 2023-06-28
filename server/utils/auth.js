const jwt = require("jsonwebtoken");
const secret = "mysecretssshhhhhhh";
const expiration = "2h";

// require("dotenv").config;
// const secret = process.env.SECRET;

module.exports = {
  authMiddleware: function (req) {
    // req.dataSources = dataSources;
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req = data;
    } catch {
      console.log("Invalid token");
    }
    return req;
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
