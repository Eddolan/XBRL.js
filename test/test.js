'use strict';
var assert = require( 'assert' );
var _      = require( 'underscore' );

var edgarScraper;

describe( 'xbrljs node module', function () {

  // importing package
  edgarScraper = require( '../js/edgarScraper' );
  var CIKHelper;


  it( 'CIKDownload should be a JS object', function(){
    CIKHelper = new edgarScraper.CIKDownload();
    var typeOfCIKHelper = typeof CIKHelper;
    assert.equal( typeOfCIKHelper, 'object' );
  });

  it( 'CIKDownload should have 4 function', function(){
    var functionNames = [ 'getCIKMap', 'getCompanyMap', 'getCIKs', 'getCompanyNames' ];
    _.each( functionNames, function( functionName ){
      var typeofProp = typeof CIKHelper[ functionName ];
      assert.equal( typeofProp, 'function' );
    });
  });

  it( 'getCIKMap should return an object relating CIKs to company names', function(){
    CIKHelper.getCIKMap().then( function( data ){
    });
  });

});

// var edgarScraper = require( '../js/edgarScraper' );

// var CIKHelper = new edgarScraper.CIKDownload();
// CIKHelper.getCompanyMap().then( function( data ){
//   console.log(data);
// });