const bookshelf = require('../config/bookshelf');

const Job = bookshelf.Model.extend({
  tableName: 'jobs',
  hasTimestamps: true
})

module.exports = Job;