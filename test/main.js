var chai = require('chai'),
    expect = chai.expect,
    //request = require('request'),
    server = require('../index.js'),
    CONSTANTS = require('../js/constants.js'),
    request = require('supertest');

describe('Server', function() {
    it('Loads the homepage.', function(done) {
        request(server)
        .get('/randomQuote')
        .expect(200)
        .end(done);
    });
    
    
});