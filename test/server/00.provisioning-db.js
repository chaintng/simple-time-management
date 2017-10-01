describe('SET UP Database', () =>{

  it ('should create database', () =>{

    const conn = {
      client: 'mysql',
      connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
      }
    }

    let knex = require('knex')(conn)

    return knex.raw(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``)
      .then(function() {
      }).then(() => {
        return knex.raw(`CREATE DATABASE ${process.env.DB_NAME}`)
      }).then(() => {
        knex.destroy();
        conn.connection.database = process.env.DB_NAME;
        knex = require('knex')(conn);
      }).then(() => {
        return knex.migrate.latest({
          directory: './migrations'
        })
      }).then(function() {
        return console.log('Finish create database')
      }).catch((e) => {
        return console.log('Has some error during database migration. ' + e.toString())
      })
  }).timeout(20000)
})