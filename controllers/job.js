const Job = require('../models/Job')
/**
 * POST /job
 */
exports.jobPost = function(req, res) {
  console.log(req)
  new Job({
    title: req.body.title,
    note: req.body.note,
    user_id: req.user.id
  }).save()
    .then(function(user) {
      res.json({status: 'OK'})
    })
}

exports.jobPut = function(req, res) {
  new Job({ id: req.body.jobId })
    .save({
      title: req.body.title,
      note: req.body.note,
      user_id: req.user.id
    })
    .then(function(job) {
    res.send({ msg: 'Job has been updated.' });
  });
}

exports.jobDel = function(req, res) {
  new Job({ id: req.body.jobId }).destroy().then(function(job) {
    res.send({ msg: 'Job has been permanently deleted.' });
  });
}

exports.jobListGet = function(req, res) {
  return new Job().fetchAll()
    .then((items) => {
      const returnObj = items.models.map((item) => ({
        id: item.get('id'),
        title: item.get('title'),
        note: item.get('note')
      }))
      return res.json(returnObj)
    })
}