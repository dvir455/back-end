const gUsers = require('../data/users.json');
const cookieParser = require('cookie-parser');
const config = require('../config');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.cryptrSecret);

module.exports = {
  login,
  auth,
  signup,
};

async function login(username, password) {
  try {
    // console.log('username', username);
    // console.log('password', password);
    const user = await gUsers.find(
      (user) => user.username === username && +user.password === +password
    );
    if (!user) throw new Error('user not found');
    const userStringify = JSON.stringify(user);
    const encryptedUserToker = cryptr.encrypt(userStringify);
    return { user, encryptedUserToker };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function signup(email, fullname, username, password) {
  try {
    const isInvalid = await gUsers.find(
      (user) => user.email === email || user.username === username
    );
    if (isInvalid) throw new Error('Email / Username already exists');
    const newUser = {
      username: username,
      password: password,
      email: email,
      _id: makeid(),
      createdAt: Date.now(),
      birth: '',
      following: {},
      followedBy: {},
      name: fullname,
      bio: '',
      profilePic: '',
    };
    gUsers.push(newUser);
    console.log('newUser', newUser);
    return 'Signup Successful';
  } catch (err) {
    throw new Error(err.message);
  }
}

//MIDDLEWARES

async function auth(req, res, next) {
  try {
    const { loginInfo } = req.cookies;
    if (!loginInfo) throw new Error('user not logged in');
    const { username, password } = JSON.parse(cryptr.decrypt(loginInfo));
    const user = gUsers.find(
      (currUser) =>
        currUser.username === username && currUser.password === password
    );
    if (!user) throw new Error('user not found');
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
}

function makeid(length = 5) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
