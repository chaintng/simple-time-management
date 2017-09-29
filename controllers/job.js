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