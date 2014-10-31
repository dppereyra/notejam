var express = require('express');
var router = express.Router();
var orm = require('orm');
var helpers = require('../helpers')

// Create new pad
router.get('/pads/create', helpers.loginRequired, function(req, res) {
  res.render('pads/create', {title: 'New pad'});
});

router.post('/pads/create', helpers.loginRequired, function(req, res) {
  var data = req.body;
  data['user_id'] = req.user.id;
  req.models.Pad.create(data, function(err, message) {
    if (err) {
      res.locals.errors = helpers.formatModelErrors(err);
    } else {
      req.flash(
        'success',
        'Pad is successfully created'
      );
      res.redirect('/');
    }
    res.render('pads/create', {title: 'New pad'});
  });
});

// Inject pad in request
router.use('/pads/:id', function(req, res, next) {
  if (req.user) {
    req.models.Pad.one(
      {id: req.param('id'), user_id: req.user.id},
      function(err, pad) {
        req.pad = pad;
        next();
      });
  } else {
    next();
  }
});

// Edit pad
router.get('/pads/:id/edit', helpers.loginRequired, function(req, res) {
  res.render('pads/edit', {title: 'Edit pad', pad: req.pad});
});

router.post('/pads/:id/edit', helpers.loginRequired, function(req, res) {
  req.pad.save({name: req.param('name')}, function(err) {
    if (err) {
      res.locals.errors = helpers.formatModelErrors(err);
      res.render('pads/edit', {title: 'Edit pad', pad: pad});
    } else {
      req.flash(
        'success',
        'Pad is successfully updated'
      );
      res.redirect('/');
    }
  });
});

module.exports = router;
