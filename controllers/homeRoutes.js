const router = require('express').Router();
const sequelize = require('../config/connection');
const { MainPost, User, Post } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    res.render('homepage', {
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/todaysposts', async (req, res) => {
  try {
    const mainPostsData = await MainPost.findAll({
      attributes: ['title'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Post,
          attributes: [
            'date_created',
            'is_mainpost',
          ],
          include: [{
            model: User,
            attributes: ['username']
          }],
        },
      ],

    });

    const posts = mainPostsData.map((mainPost) => mainPost.get({ plain: true }));
    // console.log('\x1b[33m Console logging posts info: \x1b[0m');
    // console.log(posts[0].posts[0])

    const pageTitle = 'Today\'s Posts'
    res.render('homepage', {
      pageTitle,
      partial: 'todays-posts-details',
      partialSearch: 'searchbar-details',
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/myposts', withAuth, async (req, res) => {
  try {
    const myPostsData = await Post.findAll({
      include: [
        {
          model: User,
          where: { id: req.session.user_id },
          attributes: ['username'],
        },
        {
          model: MainPost,
          attributes: ['title'],
          include: [
            {
              model: User,
              attributes: ['username']
            },
            {
              model: Post,
              attributes: ['content', 'is_mainpost', 'date_created']
            }
          ]
        }
      ]
    });

    const posts = myPostsData.map((post) => post.get({ plain: true }));
    // console.log(posts);

    const pageTitle = 'My Posts'
    res.render('homepage', {
      pageTitle,
      partial: 'my-posts-details',
      partialSearch: 'searchbar-details',
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/register', (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }

    const registerForm = true;
    res.render('login', {
      registerForm
    })
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  const loginForm = true;
  res.render('login', {
    loginForm
  });
});

module.exports = router;
