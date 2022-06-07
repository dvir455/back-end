const fs = require("fs");
const gUsers = require("../data/users.json");
const config = require("../config");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(config.cryptrSecret);

module.exports = {
  login,
  auth,
};

async function login(username, password) {
  try {
    const user = await gUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) throw new Error("user not found");
    const encryptedUserToker = cryptr.encrypt(user);
    return encryptedUserToker;
  } catch (err) {
    throw new Error(err.message);
  }
}

//MIDDLEWARES

async function auth(req, res, next) {
  try {
    const { userInfo } = req.cookie;
    const { username, password } = cryptr.decrypt(userInfo);
    const user = await gUsers.find(
      (currUser) =>
        currUser.username === username && currUser.password === password
    );
    if (!user) throw new Error("user not found");
    req.user = user;
    res.next();
  } catch (err) {
    res.send(err.message);
  }
}
