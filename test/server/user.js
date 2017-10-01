require('should');
const request = require('supertest');
const timekeeper = require('timekeeper')
const sqlFixtures = require('sql-fixtures')

const constants = require('./data/constants')
const server = require('../../server');
const datastore = require('../datastore')
const baseData = require('./data/base-data')

describe('User Controller', function() {

  timekeeper.freeze(new Date('2017-12-20'))

  beforeEach(() => {
    return Promise.all([
      datastore.deleteAllData()
    ]).then(() => {
      return sqlFixtures.create(datastore.dbConfig, baseData)
    })
  })

  it('should able to create user', function() {
    return request(server)
      .post('/signup')
      .send({
        name: 'test user',
        email: 'test@user.com',
        password: '1234'
      })
      .expect(200)
      .then(() => {
        return datastore.knex
          .select('id')
          .where('name', 'test user')
          .andWhere('email', 'test@user.com')
          .from('users')
          .then((items) => {
            return items[0].id.should.be.equal(3)
          })
      })
  });

  it('should not able to create repeated user', function() {
    return request(server)
      .post('/signup')
      .send({
        name: 'Bob',
        email: 'bob@example.com',
        password: '1234'
      })
      .expect(400)
  });

  it('should able to login', function() {
    return request(server)
      .post('/login')
      .send({
        email: 'bob@example.com',
        password: '1234'
      })
      .expect(200)
      .then((res) => {
        return res.body.token.should.be.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteS5kb21haW4uY29tIiwic3ViIjoxLCJpYXQiOjE1MTM3MjgwMDAsImV4cCI6MTUxNDMzMjgwMH0.BxMUFfNu8A8Fw5K9YHYky-bMouBd9zgeSB4SDgJEhwQ')
      })
  });

  it('should able to change password', function() {
    return request(server)
      .put('/account')
      .set({
        'Authorization': constants.JWTBearer
      })
      .send({
        id: 1,
        email: 'bob@example.com',
        password: '2345',
        confirm: '2345'
      })
      .expect(200)
      .then((res) => {
        res.body.should.deepEqual({ msg: 'Password has been changed.' })
        return datastore.knex
          .select('password')
          .where('id', 1)
          .from('users')
          .then((items) => {
            return items[0].password.should.not.equal('$2a$10$29aoi9ZA78RMYDxbVXABQOmqVVlkAfPzxuJ9ktmYuiU5rliWWYxEm')
          })
      })
  });

  it('should able to delete user', function() {
    return request(server)
      .delete('/account')
      .set({
        'Authorization': constants.JWTBearer
      })
      .send({
        id: 1
      })
      .expect(200)
      .then((res) => {
        res.body.should.deepEqual({ msg: 'User has been permanently deleted.' })
        return datastore.knex
          .where('id', 1)
          .from('users')
          .count()
          .then((count) => {
            return count[0]['count(*)'].should.equal(0)
          })
      })
  });
});