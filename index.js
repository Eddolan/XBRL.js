'use strict';



var q = console.log.bind(console, 'debugging:');


var companyService = require('./js/CompanyService.js');
var request = require('request');
var utils = require('./utils.js');
var _ = require('underscore');
var cheerio = require('cheerio');

// companyService.getCikMap( function( obj ){ console.log( obj, true ) })

// request( 'http://www.sec.gov/edgar/NYU/cik.coleft.c', function( err, resp, body ) {
//   if( !err && resp.statusCode == 200 ) {
//     this.downloadingData = false;
//     this.cachedData = body.trim();
//     // Looping through functions that were submitting while download was in progress and calling them
//     while ( funcs.length ){
//       var func = funcs.pop();
//       func( this.cachedData );
//     }
//   } else {
//     console.log( 'Error while downloading company CIKs' );
//   }
// });

var searchForms = function( CIK, type, count, page, callback ){
  var formMeta; // object to hold form data when scraping the table
  var validCounts = [10,20,40,80,100];
  var start;

  if ( !parseInt( CIK ) ){
    throw new Error( "CIK must be a number" );
  };

  if ( !type ){
    type = ''
  }

  count = count ? parseInt( count ) : 10;
  if ( validCounts.indexOf( count ) === -1 ){
    var temp = 10;
    validCounts.forEach( function( c ){
      if ( Math.abs( c - count ) < Math.abs( temp - count )){
        temp = c;
      }
    })
    count = temp;

    console.log('searchForms param count can only be 10,20,40,80,100');
    console.log('count is being converted to ' + count);
  }

  start = page ? page * count : 0;
  q( start )


  var url = 'http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=' + CIK + '&type=' + type + '&dateb=&owner=exclude&start=' + start + 'count=' + count;
  console.log(url)
  request( url, function( err, resp, body ) {
    // I had to take a shower after writing this code because it is so dirty. The wonders of webscraping.
    var $ = cheerio.load(resp.body)
    $('.tableFile2 tr').each( function( rowNum, content ){
      if ( rowNum > 1 ){
        formMeta = {}
        formMeta.formType    = content.children[1].children[0].data;
        formMeta.url         = content.children[3].children[0].attribs.href;
        formMeta.desc        = content.children[5].children[0].data;
        // second line of description box
        formMeta.desc2       = content.children[5].children[2].data;
        formMeta.date        = content.children[7].children[0].data;
        formMeta.fileUrl     = content.children[9].children[0].attribs.href;
        formMeta.fileNum     = content.children[9].children[0].children[0].data;
        formMeta.filmNum     = content.children[9].children[2].data.trim();
        q(rowNum)
      }
    })
  });
};

searchForms('0000064803', null, 21)
