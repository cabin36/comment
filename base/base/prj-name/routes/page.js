const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag, Comment } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Profile - prj-name' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Join to - prj-name' });
});

//get home page
//사용자가 get 요청을 보냈을 때
router.get('/', async (req, res, next) => {
  try {
    //모든 post 조회
    const posts = await Post.findAll({
      //관계가 있는 모델을 합쳐서 가져올 수 있음
      //관련된 모든 게시글 조회
      //게시글 가져올때 게시글 작성자도 함께 로드
      include: {
        model: User, //아이디와 닉네임을 사용자를 중심으로 필터링 한 결과 = posts
        attributes: ['id', 'nick'],
      },
      
      order: [['createdAt', 'DESC']],
    });
    const comments = await Comment.findAll({
      include:{
        model:Post,
        attributes: ['id']        
      }
    });
    
    
    //화면에 post 보여줌
    //게시글 조회 후 템플릿 엔진 렌더링
    res.render('main', {
      title: 'prj-name',
      twits: posts,comments
    });
    
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// router.get('/', async (req, res, next) => {
//   try {
//     //모든 post 조회
//     const posts = await Post.findAll({
//       //관계가 있는 모델을 합쳐서 가져올 수 있음
//       //관련된 모든 게시글 조회
//       //게시글 가져올때 게시글 작성자도 함께 로드
//       include: {
//         model: User, //아이디와 닉네임을 사용자를 중심으로 필터링 한 결과 = posts
//         attributes: ['id', 'nick'],
//       },
      
//       order: [['createdAt', 'DESC']],
//     });
//     const comments = await Comment.findAll({
//       include:{
//         model:Post,
//         attributes: ['id']        
//       }
//     });
    
    
//     //화면에 post 보여줌
//     //게시글 조회 후 템플릿 엔진 렌더링
//     res.render('main', {
//       title: 'prj-name',
//       twits: posts,comments
//     });
    
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });


//get home page
// router.get('/', async (req, res, next) => {
//   try {
//     const comments = await Comment.findAll({
//       include: {
//         model: User,
//         attributes: ['id'],
//       },
//       // include: {
//       //   model: Post,
//       //   attributes: ['id'],
//       // },
//       order: [['createdAt', 'DESC']],
//     });
//     res.render('main', {
//       title: 'prj-name',
//       twcomments: comments,
//     });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });



router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    //Hashtag table에서 요청한 ht 존재하는지 조회
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
