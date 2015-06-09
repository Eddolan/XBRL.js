

/* example usage


*/

var request = require('request');
var utils = require('../utils');
var _ = require('underscore');

function CIKDownload( ){
  var data =  new Promise( function( fulfill, reject ){
    request( 'http://www.sec.gov/edgar/NYU/cik.coleft.c', function( err, resp, body ) {
      if ( err ) reject( err );
      else fulfill( body.trim() );
    });
  });

  this.getCIKMap = function (){
    function parseData( data ){
      var dataObj = {};
      _.each( data.split( '\n' ), function ( company ){
        tempData = company.split( ':' );
        dataObj[ tempData[ 0 ]] = tempData[ 1 ];
      });
      return dataObj;
    }
    console.log(123, data);
    data.then(function(){ console.log(456)});
    return data.then( parseData );
  };

  this.getCompanyMap = function (){
    function parseData( data ){
      var dataObj = {};
      _.each( data.split( '\n' ), function ( company ){
        tempData = company.split( ':' );
        dataObj[ tempData[ 1 ]] = tempData[ 0 ];
      });
      return dataObj;
    }
    return data.then( parseData );
  };

  this.getCIKs = function (){
    var parseData = function( data ){
      var dataArr = [];
      _.each( data.split( '\n' ), function ( company ){
        dataArr.push( company.split( ':' )[1] );
      });
      return dataArr;
    }
    return data.then( parseData );
  };

  this.getCompanyNames = function (){
    var parseData = function( data ){
      var dataArr = [];
      _.each( data.split( '\n' ), function ( company ){
        dataArr.push( company.split( ':' )[0] );
      });
      return dataArr;
    }
    return data.then( parseData );
  };

};

module.exports = {
  CIKDownload: CIKDownload
};