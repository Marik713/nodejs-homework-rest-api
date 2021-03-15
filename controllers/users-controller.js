const jwt = require("jsonwebtoken");
require("dotenv").config();

const Users = require("../model/users");

const SECRET_KEY = process.env.JWT_SECRET;

async function create(req, res, next) {
  try {
    const { email } = req.body;

    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(409).json({
        status: "error",
        code: 409,
        data: "Conflict",
        message: "Email in use",
      });
    }

    const newUser = await Users.createUser(req.body);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isPasswordValid = await user.validPassword(password);

    if (!user || !isPasswordValid) {
      return res.status(401).json({
        status: "error",
        code: 401,
        data: "Unauthorized",
        message: "Email or password is wrong",
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res, next) {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(204).json({});
  } catch (e) {
    next(e);
  }
}

async function current(req, res, next) {
  try {
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription: req.user.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const id = req.user.id;
    const subscription = req.body.subscription;
    await Users.updateSubscription(id, subscription);

    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  create,
  login,
  logout,
  current,
  updateSubscription,
};
