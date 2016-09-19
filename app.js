var knex=require('knex')({
        client: 'pg',
        connection: {
            host     : '127.0.0.1',
            user     : 'ananyagoel',
            password : 'pizza',
            database : 'blog_bookshelf',
            // database: 'nodedb1',
            charset  : 'utf8'
        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: {
          tableName: 'knex_migrations'
        },
        // debug: true
});


var Bookshelf = require('bookshelf')(knex);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');


// User model
var User = Bookshelf.Model.extend({
    tableName: 'users'
});
// Post model
var Post = Bookshelf.Model.extend({
    tableName: 'posts',
    hasTimestamps: true,
    category: function () {
      return this.belongsTo(Category, 'category_id');
    },
    tags: function () {
        return this.belongsToMany(Tag);
    },
    author: function () {
        return this.belongsTo(User);
    }
});
// Category model
var Category = Bookshelf.Model.extend({
    tableName: 'categories',
    posts: function () {
       return this.hasMany(Post, 'category_id');
    }
});
// Tag model
var Tag = Bookshelf.Model.extend({
    tableName: 'tags',
    posts: function () {
       return this.belongsToMany(Post);
    }
});