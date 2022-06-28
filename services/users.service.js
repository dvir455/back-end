const gUsers = require('../data/users.json');
const config = require('../config');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.cryptrSecret);

module.exports = {
  login,
  auth,
  signup,
  userQuery,
  usersQuery,
};

async function login(username, password) {
  try {
    const user = await gUsers.find(
      (user) =>
        user.username === username && user.password + '' === password + ''
    );
    if (!user) throw new Error('user not found');
    const userStringify = JSON.stringify(user);
    const encryptedUserToker = cryptr.encrypt(userStringify);
    return { user, encryptedUserToker };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function userQuery(userName) {
  console.log(userName);
  try {
    const user = gUsers.find((currUser) => {
      return currUser.username === userName;
    });
    if (!user) throw new Error('user not found');
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}
async function usersQuery(searchValue) {
  console.log('searchValue', searchValue);
  try {
    const users = gUsers.filter((currUser) => {
      return currUser.username.includes(searchValue);
    });
    if (!users.length) throw new Error('users not found');
    const basicUsers = users.map((user) => {
      return {
        userName: user.username,
        profilePic: user.profilePic,
        _id: user._id,
        bio: user.bio,
      };
    });
    return basicUsers;
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
      _id: makeId(),
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

function makeId(length = 5) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
