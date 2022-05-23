const express = require('express');
const path = require('path');
const fs = require('fs');

const { Comment, User, Post } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();


router.post('/',isLoggedIn, async (req, res, next) => {
  try{
    //Comment 레코드 생성
    const comment = await Comment.create({
      //전달받는 parm 값
      content: req.body.content,
      UserId: req.user.id,
      postId: req.body.postID,
    });
    res.redirect("/");

  } catch (error) {
    console.error(error);
    next(error);
  }
  });




module.exports = router;
