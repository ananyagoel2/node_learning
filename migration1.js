var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'ananyagoel',
        password: 'pizza',
        database: 'blog_bookshelf',
        // database: 'nodedb1',
        charset: 'utf8'
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
var Schema =require('./schema.js');


knex.schema.raw('users', function (t) {
        t.string('mobile').changeTo('text');
  });
