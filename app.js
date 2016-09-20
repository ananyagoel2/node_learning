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

var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


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



var Users=Bookshelf.Collection.extend({
    model:User
});

var Posts=Bookshelf.Collection.extend({
    model:Post
});

var categories=Bookshelf.Collection.extend({
    model:Category
});

var Tags=Bookshelf.Collection.extend({
    model:Tag
});

// Create User route

router.route('/users')
    .get(function (req,res) {
        Users.forger()
        .fetch()
        .then(function(collection){
            res.json({error:false,data:collection.toJSON()});
        })
        .catch(function(err){
            res.status(500).json({error:true,data:{message:err.message}});
        });
    })

    .post(function(req,res){
        User.forge({
            name:req.body.name,
            email:req.body.email
        })
        .save()
        .then(function(user){
            res.json({error:false,data:{id:user.get('id')}});
        })
        .catch(function(err){
            res.status(500).json({error:true,data:{message:err.message}});
        });
    });

router.route('/user/:id')
    .get(function(req,res){
        User.forge({id:req.params.id})
        .fetch()
        .then(function(user){
            if(!user){
                res.status(404).json({error:true,data:{}});
            }
            else {
                res.json({error:false,data:user.toJSON()});
            }
        })
        .catch(function(err){
            res.status(500).json({error:true,data:{message:err.message}});
        });
    })

    .put(function(req,res){
        User.forge({id:req.params.id})
        .fetch({require:true})
        .then(function(user){
            user.save({
                name:req.body.name || user.get('name'),
                email:req.body.email || user.get('email')
            })
            .then(function(){
                res.json({error: false, data: {message: 'User details updated'}});
            })
            .catch(function(err){
                res.status(500).json({error:true,data:{message:err.message}});
            });
        })
        .catch(function(){
            res.status(500).json({error:true,data:{message:err.message}});
        });
    })

    .delete(function(req,res){
        User.forge({id:req.params.id})
        .fetch({require:true})
        .then(function(user){
            user.destroy()
            .then(function(){
              res.json({error:false,data:{message:'User successfully deleted'}});
            })
            .catch(function (err) {
              res.status(500).json({error:true,data:{message:err.message}});
            });
        })
        .catch(function(err){
          res.status(500).json({error:true,data:{message:err.message}});
        });
    });

    router.route('/categories')
      // fetch all categories
      .get(function (req, res) {
        Categories.forge()
        .fetch()
        .then(function (collection) {
          res.json({error: false, data: collection.toJSON()});
        })
        .catch(function (err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
      })

      // create a new category
      .post(function (req, res) {
        Category.forge({name: req.body.name})
        .save()
        .then(function (category) {
          res.json({error: false, data: {id: category.get('id')}});
        })
        .catch(function (err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
      });

      router.route('/categories/:id')
        // fetch all categories
        .get(function (req, res) {
          Category.forge({id: req.params.id})
          .fetch()
          .then(function (category) {
            if(!category) {
              res.status(404).json({error: true, data: {}});
            }
            else {
              res.json({error: false, data: category.toJSON()});
            }
          })
          .catch(function (err) {
            res.status(500).json({error: true, data: {message: err.message}});
          });
        })

        .put(function (req, res) {
          Category.forge({id: req.params.id})
          .fetch({require: true})
          .then(function (category) {
            category.save({name: req.body.name || category.get('name')})
            .then(function () {
              res.json({error: false, data: {message: 'Category updated'}});
            })
            .catch(function (err) {
              res.status(500).json({error: true, data: {message: err.message}});
            });
          })
          .catch(function (err) {
            res.status(500).json({error: true, data: {message: err.message}});
          });
        })
  // delete a category
    .delete(function (req, res) {
      Category.forge({id: req.params.id})
      .fetch({require: true})
      .then(function (category) {
        category.destroy()
        .then(function () {
          res.json({error: true, data: {message: 'Category successfully deleted'}});
        })
        .catch(function (err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    });

    router.route('/posts')
      // fetch all posts
      .get(function (req, res) {
        Posts.forge()
        .fetch()
        .then(function (collection) {
          res.json({error: false, data: collection.toJSON()});
        })
        .catch(function (err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
      });
    router.route('/posts/:id')
      // fetch a post by id
      .get(function (req, res) {
        Post.forge({id: req.params.id})
        .fetch({withRelated: ['category', 'tags']})
        .then(function (post) {
          if (!post) {
            res.status(404).json({error: true, data: {}});
          }
          else {
            res.json({error: false, data: post.toJSON()});
          }
        })
        .catch(function (err) {
          res.status(500).json({error: true, data: {message: err.message}});
        });
      });
