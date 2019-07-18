// This file is used as the package entry point

const path = require('path')

exports.middleware = function (express, req, res, next) {
  express.static(path.join(__dirname, 'build'))(req, res, next)
}
