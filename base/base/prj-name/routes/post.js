const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    res.redirect("/");
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// post<->comment 연결
// comment의 외래키로 postId필드 사용
// comment를 1개 생성하면 여기에 연결된 post의 id를 postId가 가지고 있음
// post로 부터 id 속성을 받아서 같으ㅡㄴ id 를 가지고 있는
// comment 를 찾음
// router.get('/:id/comment', async (req, res, next) => {
//   try{
//     const comments = await Comment.findAll({
//       //관계가 있는 모델을 합쳐서 가져올 수 있음
//       include: {
//         model: Post,
//         where: {id: req.params.id},
//       },
//     });
//   }catch(err){
//     console.error(err);
//     next(err);
//   }
// })


module.exports = router;
