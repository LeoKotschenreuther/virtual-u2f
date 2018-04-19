#!/usr/bin/env node
'use strict';

var fs = require('fs');
var ArgParse = require('argparse');

var packageInfo = require('./package');

var VU2F = require('./token');

// Setup arguments
var parser = new ArgParse.ArgumentParser({
  version: packageInfo.version,
  description: 'Virtual U2F Token CLI'
});

parser.addArgument(['mode'], {help: 'Operating mode, options are reg or sign'});
parser.addArgument(['input'], {help: 'input file name'});
parser.addArgument(['output'], {help: 'output file name'});
parser.addArgument(['-s', '--store'], {help: 'storage file, defailts to ~/.vu2f', defaultValue: '~/.vu2f'});

var args = parser.parseArgs();

// Load context if available
if(fs.existsSync(args.store)) {
    console.log("Loading context from: " + args.store);
    var keyString = fs.readFileSync(args.store);
    var keys = JSON.parse(keyString);
}

// Read input file
if(fs.existsSync(args.input)) {
    var inputString = fs.readFileSync(args.input);
    var req = JSON.parse(inputString)
} else {
    console.log("Input file: " + args.input + " not found.");
    process.exit(-1);
}


// Create the virtual token
var token = new VU2F(keys);

// Execute the desired command
var next = null;
switch(args.mode) {
    case 'reg':
        next = Register(req);
        break;
    case 'sign':
        next = Sign(req);
        break;
    default:
        console.log("Unrecognised mode argument");
        break;
}

// Finish up and write back to files
next.then(function() {
    // Write context file
    var contextString = JSON.stringify(token.ExportKeys(), null, 4);
    fs.writeFileSync(args.store, contextString);

    // Write output file
    var respString = JSON.stringify(resp, null, 4);
    fs.writeFileSync(args.output, respString);
});

var resp;

// Register an application
// This creates a key pair and handle to be associated with the application
function Register(dataIn) {
    console.log("Registering key");

    return token.HandleRegisterRequest(dataIn)
    .then(function(_resp) {
	resp = _resp;
        console.log("Registration complete. App: " + dataIn.appId + "Key Handle is: " + resp.keyHandle)
    }, function(error) {
        console.log("Registration error: " + error);
    });
}

// Sign a challenge
// This uses the registered key pair for an application to sign a challenge
// as proof of identity.
function Sign(dataIn) {
    console.log("Signing");

    return token.HandleSignRequest(dataIn)
    .then(function(_resp) {
	resp = _resp;
        console.log("Signature complete. App: " + dataIn.appId + " Key Handle is: " + resp.keyHandle)
    }, function(error) {
        console.log("Signature error:" + error);
    });
}






