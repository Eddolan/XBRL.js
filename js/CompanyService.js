

/* example usage

var companyService = new CompanyService();

// get object relating Ciks to company names with Ciks as key
companyService.getCikMap( function( obj ){ console.log( obj, true ) })

// get array of all Ciks
companyService.getCiks( function( arr ){ console.log( arr ) })

// get array of all company names
companyService.getCompanyNames( function( arr ){ console.log( arr ) })

*/

var request = require('request');
var utils = require('../utils');
var _ = require('underscore');

module.exports = {
  // Object to handle the methods for getting company names and CIKs. This object can be very large (>20MB)
  // The source of data for this object is http://www.sec.gov/edgar/NYU/cik.coleft.c
  // Initializing cache the data to avoid having to download multiple times
  cachedData : null,
  // Initializing variable to keep track of if download is in progress
  downloadingData : false,
  // Array to keep track of what functions need to be run when download successful
  onDownload : [],

  downloadCompanyCiks : function ( manipulateData ){
    // function to handle download CIKs from http://www.sec.gov/edgar/NYU/cik.coleft.c
    // function will memoize the results using CompanyService.cachedData
    if ( this.cachedData ){
      // If the data has already been downloaded then run the maninpulateData function on the data
      cb( this.cachedData );
    } else if ( this.downloadingData ){
      // If the data is being downloaded, we add to array. Function will be run on download.
      this.onDownload.push( manipulateData );
    } else{
      console.log( 'downloading company data from website. this async process can take over 10 seconds.' );
      this.downloadingData = true;
      this.onDownload.push( manipulateData )
      var funcs = this.onDownload;
      request( 'http://www.sec.gov/edgar/NYU/cik.coleft.c', function( err, resp, body ) {
        if( !err && resp.statusCode == 200 ) {
          this.downloadingData = false;
          this.cachedData = body.trim();
          // Looping through functions that were submitting while download was in progress and calling them
          while ( funcs.length ){
            var func = funcs.pop();
            func( this.cachedData );
          }
        } else {
          console.log( 'Error while downloading company CIKs' );
        }
      });

    }
  },

  getCikMap : function ( cb, reverse ){
    // function to get object relating CIKs to names
    // function will invoke callback with object { company name : CIK }
    // If reverse is passed in as true then function will invoke callback with object { CIK : company name }
    var tempData;
    var dataObj = {};

    var parseData = function( data ){
      _.each( data.split( '\n' ), function ( company ){
        tempData = company.split( ':' );
        if ( !reverse ){
          dataObj[ tempData[ 0 ]] = tempData[ 1 ];
        } else{
          dataObj[ tempData[ 1 ]] = tempData[ 0 ];
        }
      })
      cb( dataObj );
    };
    this.downloadCompanyCiks( parseData );
  },

  getCiks : function ( cb ){
    // function to get array of Ciks
    // function will invoke callback with array
    var dataArr = [];

    var parseData = function( data ){
      _.each( data.split( '\n' ), function ( company ){
        dataArr.push( company.split( ':' )[1] );
      })
      cb( dataArr );
    };
    this.downloadCompanyCiks( parseData );
  },

  getCompanyNames : function ( cb ){
    // function to get array of Company names
    // function will invoke callback with array
    var dataArr = [];

    var parseData = function( data ){
      _.each( data.split( '\n' ), function ( company ){
        dataArr.push( company.split( ':' )[0] );
      })
      cb( dataArr );
    };
    this.downloadCompanyCiks( parseData );
  }
}
