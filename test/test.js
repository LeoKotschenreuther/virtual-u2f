'use strict';

var assert = require('assert');
var u2f = require('u2f');
var VirtualToken = require('../token.js');

describe('Virtual u2f token', function() {

    var appId = "https://testapp.com";

    var token = null;
    var keyHandle = null;
    var publicKey = null;

    before(function() {
        token = new VirtualToken();
    });

    it('Handles registration requests', function() {

        var req = u2f.request(appId);

        return token.HandleRefCodeRegisterRequest(req)
        .then(function(resp) {
            console.log(resp);

            var challenge = req.challenge;

            var result = u2f.checkRegistration(req, resp);

            keyHandle = result.keyHandle;
            publicKey = result.publicKey;

            assert(result.successful);

        });
    });

    it('Handles signing requests', function() {

        var req = u2f.request(appId, keyHandle);

        return token.HandleRefCodeSignRequest(req)
        .then(function(resp) {

            assert(typeof resp.errorCode == 'undefined');

            var result = u2f.checkSignature(req, resp, publicKey);

            assert(result.successful == true);
        });

    });

});

