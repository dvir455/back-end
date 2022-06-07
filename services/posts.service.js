const fs = require('fs');
const gPosts = require('../data/posts.json');
const gUsers = require('../data/users.json');


module.exports = {
  query,
  getById,
  addComment,
  deleteComment,
  likePost,
  // remove,
  // save
};

function query(filterBy) {
  const userId = filterBy.userId;
  if (!userId) return Promise.resolve(gPosts);
  posts = gPosts.filter((post) => post.by._id == userId);
  return Promise.resolve(posts);
}

function addComment(postId, comment) {
  const post = gPosts.find((post) => post._id == postId);
  if (!post) return Promise.reject('Post not found');
  console.log('comment', comment);
  post.comments.push(comment);
  return Promise.resolve({ postId, comment });
}
function deleteComment(postId, commentId) {
  const post = gPosts.find((post) => post._id == postId);
  if (!post) return Promise.reject('Post not found');
  const commentIdx = post.comments.findIndex(
    (comment) => comment.id == commentId
  );
  if (commentIdx < 0) return Promise.reject('Comment not found');
  // console.log('comment', comment);
  post.comments.splice(commentIdx, 1);
  return Promise.resolve({ postId, commentIdx });
}

function likePost(request) {
  const { postId, userId, likeInfo } = request;
  console.log('request', request);
  const post = gPosts.find((post) => {
    return post._id == postId;
  });
  if (!post) return Promise.reject('Post not found');
  const liked = post.likedBy.find((like) => like._id == userId);
  const likeIdx = post.likedBy.findIndex((like) => like._id == userId);
  if (liked) {
    post.likedBy.splice(post.likedBy.indexOf(liked), 1);
  } else {
    post.likedBy.push(likeInfo);
  }

  return Promise.resolve({ likeIdx, postId, liked });
}

// function save(car) {
//     if (car._id) {
//         const idx = gCars.findIndex(currCar => currCar._id === car._id)
//         gCars[idx] = car
//     } else {
//         car._id = _makeId()
//         gCars.push(car)
//     }
//     return _saveCarsToFile().then(()=>car)
// }

// function remove(carId) {
//     const idx = gCars.findIndex(car => car._id === carId)
//     gCars.splice(idx, 1)
//     return _saveCarsToFile()
// }

function getById(postId) {
  const post = gPosts.find((post) => post._id === postId);
  return Promise.resolve(post);
}

function _makeId(length = 5) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var txt = '';
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function _savePostsToFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile('data/posts.json', JSON.stringify(gPosts, null, 2), (err) => {
      if (err) {
        console.log(err);
        reject('Cannot write to file');
      } else {
        console.log('Wrote Successfully!');
        resolve();
      }
    });
  });
}
