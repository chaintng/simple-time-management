require('should');
const request = require('supertest');
const timekeeper = require('timekeeper')
const sqlFixtures = require('sql-fixtures')

const server = require('../../server');
const datastore = require('../datastore')
const baseData = require('./data/base-data')
const constants = require('./data/constants')

describe('User Controller', function() {

  timekeeper.freeze(new Date('2017-12-20'))

  beforeEach(() => {
    return Promise.all([
      datastore.deleteAllData()
    ]).then(() => {
      return sqlFixtures.create(datastore.dbConfig, baseData)
    })
  })

  it('should able to fetch jobs', function() {
    return request(server)
      .get('/job-list?date_from=2017-12-20&date_to=2017-12-21')
      .set({
        'Authorization': constants.JWTBearer
      })
      .expect(200)
      .then((res) => {
        res.body.length.should.be.equal(2)
        res.body[0].should.be.deepEqual({
          "date": "2017-12-21",
          "hour": 4,
          "id": 2,
          "note": "Without CSS Styling",
          "preferred_working_hour": 8,
          "title": "Login Component",
          "user_id": 1,
          "user_name": "Bob"
        })
      })
  });

  it('should able to add job', function() {
    return request(server)
      .post('/job')
      .send({
        title: 'Register',
        note: 'Register Page',
        date: new Date('2017-12-25'),
        hour: 8
      })
      .set({
        'Authorization': constants.JWTBearer
      })
      .expect(200)
      .then((res) => {
        res.body.should.be.deepEqual({
          "msg": "Job has been inserted."
        })
        return datastore.knex
          .where('title', 'Register')
          .from('jobs')
          .count()
          .then((count) => {
            return count[0]['count(*)'].should.equal(1)
          })
      })
  });

  it('should able to delete job', function() {
    return request(server)
      .delete('/job')
      .send({
        jobId: 3
      })
      .set({
        'Authorization': constants.JWTBearer
      })
      .expect(200)
      .then((res) => {
        res.body.should.be.deepEqual({
          "msg": "Job has been permanently deleted."
        })
        return datastore.knex
          .where('id', 3)
          .from('jobs')
          .count()
          .then((count) => {
            return count[0]['count(*)'].should.equal(0)
          })
      })
  });

  it('should note able to delete other user\'s job', function() {
    return request(server)
      .delete('/job')
      .send({
        jobId: 4
      })
      .set({
        'Authorization': constants.JWTBearer
      })
      .expect(400)
  });
});