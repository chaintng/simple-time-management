const moment = require('moment')

const Job = require('../models/Job')
/**
 * POST /job
 */
exports.jobPost = function(req, res) {
  console.log(req)
  new Job({
    title: req.body.title,
    date: req.body.date,
    hour: req.body.hour,
    note: req.body.note,
    user_id: req.user.id
  }).save()
    .then(function(user) {
      res.json({status: 'OK'})
    })
}

exports.jobPut = function(req, res) {
  new Job({ id: req.body.id })
    .save({
      title: req.body.title,
      date: req.body.date,
      hour: req.body.hour,
      note: req.body.note,
      user_id: req.user.id
    })
    .then(function(job) {
    res.send({ msg: 'Job has been updated.' });
  });
}

exports.jobDel = function(req, res) {
  new Job({ id: req.body.jobId }).destroy().then(function() {
    res.send({ msg: 'Job has been permanently deleted.' });
  });
}

exports.jobListGet = function(req, res) {
  return Job.query((qb) => {
    if (req.query.date_from) {
      qb.andWhere('date', '>=', req.query.date_from)
    }

    if (req.query.date_to) {
      qb.andWhere('date', '<=', req.query.date_to)
    }

    qb.where('user_id', '=', req.user.id)
      .orderBy('date', 'DESC')
  }).fetchAll()
    .then((items) => {
      const returnObj = items.models.map((item) => ({
        id: item.get('id'),
        title: item.get('title'),
        note: item.get('note'),
        date: item.get('date') ? moment(item.get('date')).format('YYYY-MM-DD') : null,
        hour: item.get('hour')
      }))
      return res.json(returnObj)
    })
}