const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    console.log('======================');
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE  post.id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            console.log(dbPostData[0]);
            const posts = dbPostData.map(post => post.get({ plain: true }));  
            //pass a single post object into the homepage template
            res.render('homepage', { posts });
        })
       .catch(err => {
           console.log(err);
            res.status(500).json(err);
        });
});
router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/post/:id', (req,res) => {
      const post = {
          id: 1,
          post_url: 'https://handlebarsjs.com/guide/',
          title: 'Handlebars Doc',
          created_at: new Date(),
          vote_count: 10,
          user: {
              username: 'test_user'
          }
      };
      res.render('single-post', { post });
  });



module.exports = router;