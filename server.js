const express = require('express');
const cookieParser = require('cookie-parser');
const postService = require('./services/posts.service');
const usersService = require('./services/users.service');
const config = require('./config.js');

const app = express();
const cors = require('cors');

// Config the Express App
// app.use(express.static('public'))
app.use(express.json());
app.use(cors(config.corsOptions));
app.use(cookieParser());

const { auth } = usersService;

app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userToken = await usersService.login(username, password);
    // console.log('userToken', userToken);
    // res.cookie('loginInfo', userToken);
    res.cookie('loginInfo', userToken.encryptedUserToker);
    res.send({ username: userToken.user.username, _id: userToken.user._id });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

app.get('/api/user/logout', (req, res) => {
  res.clearCookie('loginInfo').send('Logged Out');
});

app.get('/api/posts', (req, res) => {
  const filterBy = { userId: req.query.userId || '' };
  postService.query(filterBy).then((posts) => res.send(posts));
});

app.post('/api/posts', auth, (req, res) => {
  const { postId, commentTxt, commentId } = req.body;
  const { user } = req;
  postService
    .addComment({
      postId,
      comment: {
        id: commentId,
        by: {
          _id: user._id,
          fullname: user.name,
          imgUrl: user.profilePic,
        },
        txt: commentTxt,
        likedBy: [],
      },
    })
    .then((postCommentsInfo) => {
      console.log('addedComment', postCommentsInfo);
      res.send(postCommentsInfo);
    })
    .catch((err) => {
      res.status(502).send(err);
    });
});
app.post('/api/posts/:postId/like', auth, (req, res) => {
  const { postId } = req.params;
  // console.log('postId', postId);
  // const { userId } = req.cookies;
  // if (!userId) return res.status(401).send('Cannot add car')
  const { user } = req;
  postService
    .likePost({
      postId,
      likeInfo: {
        _id: user._id,
        fullname: user.name,
        imgUrl: user.profilePic,
      },
    })
    .then((likeStatus) => {
      console.log('likeStatus', likeStatus);
      res.send(likeStatus);
    })
    .catch((err) => {
      res.status(502).send(err);
    });
});

app.delete('/api/posts/:postId/:commentId', auth, (req, res) => {
  const { postId, commentId } = req.params;
  const { user } = req;
  postService
    .deleteComment(postId, commentId, user)
    .then((deletedCommentInfo) => {
      res.send(deletedCommentInfo);
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

// app.get('/api/car/save', (req, res) => {
//     const car = {_id: req.query._id, vendor: req.query.vendor, price: +req.query.price}
//     console.log('Car to Save:', car)
//     carService.save(car)
//         .then((savedCar) => {
//             console.log('Saved Car', savedCar)
//             res.send(savedCar)
//         })
// })

app.get('/api/posts/:postId', (req, res) => {
  const { postId } = req.params;
  postService.getById(postId).then((post) => {
    res.send(post);
  });
});

app.listen(3030);
console.log('Server is ready at 3030');
