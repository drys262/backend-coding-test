'use strict'

const isWindows = require('is-windows')()

module.exports = {
  branches: 80,
  'check-coverage': !isWindows,
  exclude: [
    'coverage',
  ],
  functions: 80,
  lines: 80,
  statements: 80
}