var createError = require('http-errors');

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const authHandler = (req, res, next) => {
  if(req.session.userid) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

module.exports = {
  validateEmail: validateEmail,
  authHandler: authHandler
}