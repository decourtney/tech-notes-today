const router = require('express').Router();
const { Post, User, MainPost } = require('../../models');

router.post('/', async (req, res) => {
  try
  {
    const postContentData = await MainPost.findOne({
      where: {
        title: req.body.title
      },
      include: [
        {
          model: User,
          where: {username: req.body.username},
          attributes: ['username'],
        },
        {
          model: Post,
          attributes: [
            'date_created',
            'content',
            'is_mainpost',
          ],
          include:[
            {
              model: User,
              attributes: ['username']
            }
          ]
        }
      ],
    });
  
    const content = postContentData.get({ plain: true });
    console.log(content);
  
    res.status(200).json(content)
  } catch (err)
  {
    res.status(500).json(err);
  }
});

module.exports = router;
