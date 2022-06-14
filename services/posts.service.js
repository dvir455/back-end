const fs = require('fs');
const gPosts = require('../data/posts.json');

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

function addComment(request) {
  const { postId, comment } = request;
  const post = gPosts.find((post) => post._id == postId);
  if (!post) return Promise.reject('Post not found');
  post.comments.push(comment);
  return Promise.resolve({ postId, postComments:post.comments });
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
  const { postId, likeInfo } = request;
  const post = gPosts.find((post) => {
    return post._id == postId;
  });
  if (!post) return Promise.reject('Post not found');
  //TODO CHANGE TO _userId
  const likeIdx = post.likedBy.findIndex((like) => like._id === likeInfo._id);
  if (likeIdx >= 0) {
    post.likedBy.splice(likeIdx, 1);
  } else {
    post.likedBy.push(likeInfo);
  }

  return Promise.resolve({ postId, likedBy: post.likedBy });
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
