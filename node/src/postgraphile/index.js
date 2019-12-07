//Need to avoid import or export not defined issue
require('@babel/register');

//Need to avoid regeneratorRuntime not defined issue
require('@babel/polyfill');

require('./app');