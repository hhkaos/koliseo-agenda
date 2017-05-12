// specify libraries to compile with Babel. Everything else will be ignored
// this file is used by our Mocha execution command
// see http://stackoverflow.com/questions/35040978/babel-unexpected-token-import-when-running-mocha-tests
require('babel-core/register')({
  ignore: /node_modules\/(?!alt-ng|preact)/
})
