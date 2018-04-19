# Virtual U2F Token

A virtual U2F token for automated testing of U2F enabled applications.  

Based on [mplatt/virtual-u2f](https://github.com/mplatt/virtual-u2f), updated to comply with the [U2F Javascript Spec](https://fidoalliance.org/specs/fido-u2f-v1.0-nfc-bt-amendment-20150514/fido-u2f-javascript-api.html#dictionary-u2frequest-members).  

[![Build Status](https://travis-ci.org/ryankurte/virtual-u2f.svg)](https://travis-ci.org/ryankurte/virtual-u2f) [![Dependencies](https://david-dm.org/ryankurte/virtual-u2f.svg)](https://david-dm.org/ryankurte/virtual-u2f)  

Check it out on [npm](https://www.npmjs.com/package/virtual-u2f)  

## Usage


### Registration
```
var VirtualToken = require('virtual-u2f');

// Generate Registration request
...

// Handle registration request
token.HandleRegisterRequest(request)
.then(function(response) {
    // Finalise registration
    ...
}, function(error) {
    // Handle error
    ...
});

```

### Signing / Authentication
```
var VirtualToken = require('virtual-u2f');

// Generate Signing request
...

// Handle registration request
token.HandleSignatureRequest(request)
.then(function(response) {
    // Finalise Signing
    ...
}, function(error) {
    // Handle error
    ...
});

```

For a worked example running against [ryankurte/node-u2f](https://github.com/ryankurte/node-u2f) (my fork of [ashtuchkin/u2f](https://github.com/ashtuchkin/u2f)), check out [test.js](test/test.js).  


There is also a simple command line application that accepts registration and signing challenges and outputs responses (both in JSON), in case you need to test non-javascript based applications.

------

If you have any questions, comments, or suggestions, feel free to open an issue or a pull request.
