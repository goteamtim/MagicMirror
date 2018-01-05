var chai = require('chai'),
expect = chai.expect,
//request = require('request'),
server = require('../index.js'),
CONSTANTS = require('../js/constants.js'),
request = require('supertest'),
mirror = require( '../dist/js/mirror.js' );

describe('Mirror tests',function()
{
    before("Mock local storage", function( done ){
        global.window = { localStorage: '' };
    } )
    it('Should do things',function( done )
    {
        for(var i = 0; i < 10; i++){
            expect( mirror.zeroBuffer( i ) ).to.equal( 0+i );
        }
    });
} );