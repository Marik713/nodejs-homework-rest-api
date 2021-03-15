const User = require("./schemas/user-schema");

async function createUser(body) {
  const user = await User.create(body);
  return user;
}

async function findByEmail(email) {
  const user = await User.findOne({ email });
  return user;
}

async function findById(id) {
  const user = await User.findOne({ _id: id });
  return user;
}

async function updateToken(id, token) {
  return await User.updateOne({ _id: id }, { token });
}

async function updateSubscription(id, subscription) {
  return await User.findByIdAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
}

module.exports = {
  createUser,
  findByEmail,
  updateToken,
  findById,
  updateSubscription,
};
