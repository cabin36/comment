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

  // router.get('/:id/comment', async (req, res, next) => {
  //   try{
  //     const comment = await Comment.findAll({
  //       //관계가 있는 모델을 합쳐서 가져올 수 있음
  //       include: {
  //         model: User,
  //         where: {id: req.params.id},
  //       },
  //     });
  //   }catch(err){
  //     console.error(err);
  //     next(err);
  //   }
  // })

//comment의 id를 받아서 수정
router.route('/:id')
  .patch(async (req, res, next) => {
    try{
      const result = await Comment.update({
        content: req.body.content,
      },{
        where: {id: req.params.id},
      });
      res.json(result);
    }catch(err){
      console.error(err);
      next(err);
    }
  })

  //comment의 id를 받아서 삭제
  .delete(async (req, res, next) => {
    try{
      const result = await Comment.destroy({
        where: { id: req.params.id}
      });
      res.json(result);
    }catch(err){
      console.error(err);
      next(err);
    }
  });

module.exports = router;
