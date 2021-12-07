'use strict'

const isWindows = require('is-windows')()

module.exports = {
  exclude: [
    'coverage',
  ],
  'check-coverage': !isWindows,
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80
}