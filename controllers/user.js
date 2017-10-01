import Job from "../models/Job";

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var User = require('../models/User');
var USER_ROLES = require('../config/constants').USER_ROLES
var ACCESS_ROLES = require('../config/constants').ACCESS_ROLES

function generateToken(user) {
  var payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

/**
 * POST /login
 * Sign in with email and password
 */
exports.loginPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  new User({ email: req.body.email })
    .fetch()
    .then(function(user) {
      if (!user) {
        return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
        'Double-check your email address and try again.'
        });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ msg: 'Invalid email or password' });
        }
        res.send({ token: generateToken(user), user: user.toJSON() });
      });
    });
};

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: USER_ROLES.REGULAR_USER
  }).save()
    .then(function(user) {
        res.send({ token: generateToken(user), user: user });
    })
    .catch(function(err) {
      if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
        return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
      }
    });
};


/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountSave = function(req, res, next) {
  _checkPermission(req, res)

  const isCreateUser = req.method === 'POST'
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  let user
  let saveData = {
    email: req.body.email,
    name: req.body.name,
    gender: req.body.gender,
    preferred_working_hour: req.body.preferred_working_hour,
    role: req.body.role || USER_ROLES.REGULAR_USER
  }

  user = new User({ id: req.body.id });

  if (isCreateUser) {
    saveData.password = req.body.password
    user = new User();
  } else if ('password' in req.body) {
    saveData = {password: req.body.password}
  }

  user.save(saveData, { patch: !isCreateUser });

  user.fetch().then(function(user) {
    if ('password' in req.body && !isCreateUser) {
      res.send({ msg: 'Password has been changed.' });
    } else {
      res.send({ user: user, msg: 'Profile information has been saved.' });
    }
    res.redirect('/account');
  }).catch(function(err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
    }
  });
};

/**
 * DELETE /account
 */
exports.accountDelete = function(req, res, next) {
  _checkPermission(req, res)
  new Job()
    .where({user_id: req.body.id})
    .destroy()
    .then(() => {
      return new User({ id: req.body.id })
        .destroy()
        .then(function(user) {
          res.send({ msg: 'User has been permanently deleted.' });
        })
    })
    .catch(function(err) {
      res.status(500).send({ msg: `Server Error: ${err.toString()}` });
    });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = function(req, res, next) {
  new User({ id: req.user.id })
    .fetch()
    .then(function(user) {
      switch (req.params.provider) {
        case 'facebook':
          user.set('facebook', null);
          break;
        case 'google':
          user.set('google', null);
          break;
        case 'twitter':
          user.set('twitter', null);
          break;
        case 'vk':
          user.set('vk', null);
          break;
        default:
        return res.status(400).send({ msg: 'Invalid OAuth Provider' });
      }
      user.save(user.changed, { patch: true }).then(function() {
      res.send({ msg: 'Your account has been unlinked.' });
      });
    });
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      new User({ email: req.body.email })
        .fetch()
        .then(function(user) {
          if (!user) {
        return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
          }
          user.set('password_reset_token', token);
          user.set('password_reset_expires', new Date(Date.now() + 3600000)); // expire in 1 hour
          user.save(user.changed, { patch: true }).then(function() {
            done(null, token, user.toJSON());
          });
        });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'support@yourdomain.com',
        subject: '✔ Reset your password on Mega Boilerplate',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
        done(err);
      });
    }
  ]);
};

/**
 * POST /reset
 */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
      return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      new User({ password_reset_token: req.params.token })
        .where('password_reset_expires', '>', new Date())
        .fetch()
        .then(function(user) {
          if (!user) {
          return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
          }
          user.set('password', req.body.password);
          user.set('password_reset_token', null);
          user.set('password_reset_expires', null);
          user.save(user.changed, { patch: true }).then(function() {
          done(err, user.toJSON());
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        from: 'support@yourdomain.com',
        to: user.email,
        subject: 'Your Mega Boilerplate password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.send({ msg: 'Your password has been changed successfully.' });
      });
    }
  ]);
};
/**
 * POST /auth/google
 * Sign in with Google
 */
exports.authGoogle = function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve user's profile information.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message });
      }
      // Step 3a. Link accounts if user is authenticated.
      if (req.isAuthenticated()) {
        new User({ google: profile.sub })
          .fetch()
          .then(function(user) {
            if (user) {
              return res.status(409).send({ msg: 'There is already an existing account linked with Google that belongs to you.' });
            }
            user = req.user;
            user.set('name', user.get('name') || profile.name);
            user.set('gender', user.get('gender') || profile.gender);
            user.set('picture', user.get('picture') || profile.picture.replace('sz=50', 'sz=200'));
            user.set('location', user.get('location') || profile.location);
            user.set('google', profile.sub);
            user.save(user.changed, { patch: true }).then(function() {
              res.send({ token: generateToken(user), user: user });
            });
          });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        new User({ google: profile.sub })
          .fetch()
          .then(function(user) {
            if (user) {
              return res.send({ token: generateToken(user), user: user });
            }
            new User({ email: profile.email })
              .fetch()
              .then(function(user) {
                if (user) {
                  return res.status(400).send({ msg: user.get('email') + ' is already associated with another account.' })
                }
                user = new User();
                user.set('name', profile.name);
                user.set('email', profile.email);
                user.set('role', USER_ROLES.REGULAR_USER)
                user.set('gender', profile.gender);
                user.set('location', profile.location);
                user.set('picture', profile.picture.replace('sz=50', 'sz=200'));
                user.set('google', profile.sub);
                user.save().then(function(user) {
                  res.send({ token: generateToken(user), user: user });
                });
              });
          });
      }
    });
  });
};

exports.authGoogleCallback = function(req, res) {
  res.render('loading');
};


exports.userListGet = function(req, res) {
  if (ACCESS_ROLES.CAN_MANAGE_USER.indexOf(req.user.get('role')) < 0) {
    return res.status(400).send({msg: 'Only ADMIN_USER and USER_MANAGER are allowed.'})
  }

  return new User().fetchAll()
    .then((items) => {
      const returnObj = items.models.map((item) => ({
        id: item.get('id'),
        name: item.get('name'),
        email: item.get('email'),
        preferred_working_hour: item.get('preferred_working_hour'),
        role: item.get('role')
      }))
      return res.json(returnObj)
    })
}


/**
 * POST /login
 * Sign in with email and password
 */
exports.userGet = function(req, res, next) {
  _checkPermission(req, res)

  return new User({ id: req.query.user_id || req.user.get('id') })
    .fetch()
    .then((item) => {
      return res.json(item.toJSON())
    })
};

function _checkPermission(req, res) {
  if (ACCESS_ROLES.CAN_MANAGE_USER.indexOf(req.user.get('role')) < 0
    && (
      (!!req.query.user_id && req.user.get('id') !== req.query.user_id)
      || (!!req.body.id && req.user.get('id') !== req.body.id)
    )) {
    return res.status(400).send({msg: 'Only ADMIN_USER are allowed.'})
  }
}