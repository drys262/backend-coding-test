import isWindows from 'is-windows';

export default {
  branches: 80,
  'check-coverage': !isWindows,
  exclude: [
    'coverage',
  ],
  functions: 80,
  lines: 80,
  statements: 80
}