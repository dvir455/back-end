const express = require("express");
const cookieParser = require("cookie-parser");
const postService = require("./services/posts.service");
const usersService = require("./services/users.service");

// const config = require("./config.js");
const app = express();
const cors = require("cors");
// const Cryptr = require("cryptr");
// const cryptr = new Cryptr(config.cryptrSecret);

// Config the Express App
// app.use(express.static('public'))
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const {auth} = usersService

app.post("/api/user/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userToken = await usersService.login(username, password);
    // if (!foundUser) res.status(404).send("User not Found");
    res.cookie("loginInfo", userToken);
    res.send("Login Success");
  } catch (err) {
    res.send(err.message);
  }
});

app.get("/api/user/logout", (req, res) => {
  res.clearCookie("loginInfo").send("Logged Out");
});

app.get("/api/posts", (req, res) => {
  const filterBy = { userId: req.query.userId || "" };
  postService.query(filterBy).then((posts) => res.send(posts));
});

app.post("/api/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const comment = req.body;
  // const { userId } = req.cookies;
  // if (!userId) return res.status(401).send('Cannot add car')
  postService
    .addComment(postId, comment)
    .then((addedComment) => {
      res.send(addedComment);
    })
    .catch((err) => {
      res.status(502).send(err);
    });
});
app.post("/api/posts/:postId/like", auth,(req, res) => {
  // const { postId } = req.params;
  const { postId } = req.body;
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
      }
    })
    .then((likeStatus) => {
      res.send(likeStatus);
    })
    .catch((err) => {
      res.status(502).send(err);
    });
});

app.delete("/api/posts/:postId/:commentId", (req, res) => {
  const { postId } = req.params;
  const { commentId } = req.params;
  // const { userId } = req.cookies;
  // if (!userId) return res.status(401).send('Cannot add car')
  postService
    .deleteComment(postId, commentId)
    .then((deletedComment) => {
      res.send(deletedComment);
    })
    .catch((err) => {
      res.send(err);
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

app.get("/api/posts/:postId", (req, res) => {
  const { postId } = req.params;
  postService.getById(postId).then((post) => {
    res.send(post);
  });
});

// app.get('/api/car/:carId/remove', (req, res) => {
//     const {carId} = req.params
//     carService.remove(carId)
//         .then(() => {
//             console.log('Removed Car', carId)
//             res.send('Removed Succesfully')
//         })
// })

app.listen(3030);
console.log("Server is ready at 3030");
