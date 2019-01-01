'use strict';

const path = require('path');
const args = require('minimist')(process.argv.slice(2));


// List of allowed environments
const allowedEnvs = ['development', 'production'];

// Set the correct environment
let env;
if (args._.length > 0 && args._.indexOf('start') !== -1) {
    env = 'development';
} else if (args.mode) {
    env = args.mode;
}
process.env.REACT_WEBPACK_ENV = env;

//console.log(args)

function buildConfig(wantedEnv) {
    let isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;
    let validEnv = isValid ? wantedEnv : 'development';

    let configPath = path.join(__dirname, 'cfg/' + validEnv);
    //console.log(configPath);
    let config = require(configPath);
    return config;
}

module.exports = buildConfig(env);