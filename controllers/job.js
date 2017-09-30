const moment = require('moment')

const Job = require('../models/Job')
const USER_ROLES = require('../config/constants').USER_ROLES

/**
 * POST /job
 */
exports.jobPost = function(req, res) {
  const errorMsg = _validateInput(req.body)
  if (errorMsg) {
    return res.status(400).send({ msg: errorMsg })
  }

  new Job({
    user_id: req.user.id,
    date: req.body.date
  }).fetch()
    .then((item) => {
      if (item) {
        return res
          .status(400)
          .send({ msg: 'User already input the job in this date. Please edit the record instead.' })
      }

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
    })

}

exports.jobPut = function(req, res) {
  const errorMsg = _validateInput(req.body)
  if (errorMsg) {
    return res.status(400).send({ msg: errorMsg })
  }

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

    if (req.user.get('role') !== USER_ROLES.ADMIN_USER ) {
      qb.where('user_id', '=', req.user.id)
    }

    qb.join('users', 'jobs.user_id', 'users.id')
    qb.orderBy('date', 'DESC')
    qb.select('jobs.id', 'users.name', 'jobs.title', 'jobs.note', 'jobs.date', 'jobs.hour')
  }).fetchAll()
    .then((items) => {
      const returnObj = items.models.map((item) => ({
        id: item.get('id'),
        user_name: item.get('name'),
        title: item.get('title'),
        note: item.get('note'),
        date: item.get('date') ? moment(item.get('date')).format('YYYY-MM-DD') : null,
        hour: item.get('hour')
      }))
      return res.json(returnObj)
    })
}

function _validateInput(input) {
  if (input.hour > 24) {
    return 'Input hour is more than 24 hours.'
  }
  if (input.hour <= 0) {
    return 'Input hour should be integer number that more than 0.'
  }
}