var chai = require('chai'),
    expect = chai.expect,
    request = require('request'),
    server = require('../index.js'),
    CONSTANTS = require('../js/constants.js'),
    chaiHttp = require('chai-http');
    
    chai.use(chaiHttp);

    describe('Server', function() {
        
        it('Random quote returns object.', function(done) {
            chai.request(server)
            .get('/randomQuote')
            .end(function(res,err){
                console.log(res)
                expect(res).to.be.a('object');
                done();
            });
            
        });
      });