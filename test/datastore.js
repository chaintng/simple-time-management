const conn = {
  client: 'mysql',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
}

const knex = require('knex')(conn)

function deleteAllData() {
  return knex
    .raw('SET foreign_key_checks = 0')
    .then(() => {
      return knex.raw('TRUNCATE TABLE jobs')
    }).then(() => {
      return knex.raw('TRUNCATE TABLE users')
    }).then(() => {
      return knex.raw('SET foreign_key_checks = 1')
    })
}

module.exports = {
  dbConfig: conn,
  knex,
  deleteAllData
}
