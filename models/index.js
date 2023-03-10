const User = require('./User');
const MainPost = require('./MainPost');
const Post = require('./Post');

User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE' // TODO Test this value.
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE' // User deletes a post then all references should be removed
});

User.hasMany(MainPost, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

MainPost.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

MainPost.hasMany(Post, {
  foreignKey: 'mainpost_id',
  onDelete: 'CASCADE'
});

Post.belongsTo(MainPost, {
  foreignKey: 'mainpost_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Post, MainPost };
