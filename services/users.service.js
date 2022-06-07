const fs = require("fs");
const gUsers = require("../data/users.json");

module.exports = {
  login,
};

async function login(username, password) {
  try {
    const user = await gUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) throw new Error("user not found");
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}
