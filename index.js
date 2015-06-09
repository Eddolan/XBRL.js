// 'use strict';



// var q = console.log.bind(console, 'debugging:');


// var companyService = require('./js/CompanyService.js');
// var request = require('request');
// var utils = require('./utils.js');
// var _ = require('underscore');
// var cheerio = require('cheerio');

// // companyService.getCikMap( function( arr ){ console.log( arr ) })

// var searchForms = function( CIK, formType, count, page, cb ){
//   // This function webscrapes the Edgar search page at this url:
//   // http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000064803&owner=exclude&count=40&hidefilings=0
//   // The result is an array of objects which contain basic information about the filings as well as a link to
//   // the webpage where the XBRL documents are hosted

//   var xbrlMeta; // object to hold form data when scraping the table
//   // The only valid counts for the search
//   var validCounts = [10,20,40,80,100];
//   // This function takes page as a paramater but the search epects the start number
//   var start;
//   // array to hold the filings
//   var filings = [];
//   var $;
//   var url;
//   var temp;

//   // validating CIK
//   if ( !parseInt( CIK ) ){
//     throw new Error( "CIK must be a number" );
//   };

//   // validating form-formType
//   if ( !formType ){
//     formType = ''
//   }

//   // validating count
//   count = count ? parseInt( count ) : 10;
//   // If count isn't one of the allowed counts we conver it and print a message
//   // It would not break the search to omit this check, but this could confuse the user
//   if ( validCounts.indexOf( count ) === -1 ){
//     temp = 10;
//     validCounts.forEach( function( c ){
//       if ( Math.abs( c - count ) < Math.abs( temp - count )){
//         temp = c;
//       }
//     })
//     count = temp;

//     console.log('searchForms param count can only be 10,20,40,80,100');
//     console.log('count is being converted to ' + count);
//   }

//   // converting from page number to start number
//   start = page ? page * count : 0;

//   // building the url
//   url = 'http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=' + CIK + '&type=' + formType+ '&dateb=&owner=exclude&start=' + start + 'count=' + count;

//   if ( !cb ){
//     console.log( 'No callback was provided. To searchForms(). The data will be logged to the console');
//     cb = console.log.bind(console, 'Downloaded data is: ');
//   }

//   // sending request
//   request( url, function( err, resp, body ) {
//     if ( err ){
//       console.log( 'Error searching for filings' );
//       throw new Error( err );
//     }

//     // webscraping
//     $ = cheerio.load(body)
//     $('.tableFile2 tr').each( function( rowNum, content ){
//       // I had to take a shower after writing this code because it is so dirty. The wonders of webscraping.
//       // First row is header
//       if ( rowNum > 1 ){
//         // The data is nested in the tables in a very awkward structure. There are lots of
//         // cells in teh table that are basically entry so the location of the right data
//         // has to unfortunately be statically typed.
//         xbrlMeta = {}
//         xbrlMeta.formType    = content.children[1].children[0].data;
//         xbrlMeta.url         = 'http://www.sec.gov' + content.children[3].children[0].attribs.href;
//         xbrlMeta.desc        = content.children[5].children[0].data;
//         // second line of description box
//         xbrlMeta.desc2       = content.children[5].children[2].data;
//         xbrlMeta.date        = content.children[7].children[0].data;
//         // file and film numbs are often omitted
//         xbrlMeta.fileUrl     = content.children[9].children[0] ? content.children[9].children[0].attribs.href : null;
//         xbrlMeta.fileNum     = content.children[9].children[0] ? content.children[9].children[0].children[0].data : null;
//         xbrlMeta.filmNum     = content.children[9].children[2] ? content.children[9].children[2].data.trim() : null;
//         filings.push(xbrlMeta);
//       }
//     })
//     cb(filings);
//   });
// };

// var getDocuments = function( target, cb ){
//   // Function takes a url of a SEC filing page (http://www.sec.gov/Archives/edgar/data/64803/000006480314000008/0000064803-14-000008-index.htm)
//   // and attempts to look for the XBRL related docujents for that filing. Will return an object
//   // of all of the valid relating xbrl documents
//   var url;
//   var testURLs;
//   var returnObj;
//   var $;
//   var formMeta;
//   var forms = [];
//   if ( typeof target === 'string' ){
//     url = target;
//     returnObj = {url: target};
//   } else{
//     url = target.url;
//   }

//   request( url, function( err, resp, body ) {
//     if ( err ){
//       console.log( 'Error getting filings' );
//       throw new Error( err );
//     }

//     $ = cheerio.load(body)
//     $('table[summary="Data Files"]').children().each( function( rowNum, content ){
//       if ( rowNum !== 0){
//         formMeta = {};
//         formMeta.title = content.children[3].children[0].data;
//         formMeta.url = 'http://www.sec.gov' + content.children[5].children[0].attribs.href;
//         formMeta.name = content.children[5].children[0].children[0].data;
//         formMeta.type = content.children[7].children[0].data;
//         formMeta.size = content.children[9].children[0].data;
//         forms.push(formMeta);
//       }
//     })
//     cb(forms);
//   });

// };

// var xmlRecurse = function( el , cb ){
//   // recurses through an xml document and applies callback to each element
//   cb( el );
//   if ( el.children ){
//     el.children.forEach( function( child ){
//       xmlRecurse( child, cb );
//     })
//   }
// };

// var getTags = function( document, cb ){

//   var tags = [];
//   var $;
//   var tagSelector = function( el ){
//     if ( el.type === 'tag' && el.children.length === 1){
//       tags.push( {
//         name:    el.name,
//         attribs: el.attribs,
//         data:    el.children[0].data
//       } );
//     }
//   }

//   request( document, function ( err, resp, body ){
//     if ( err )  {
//       console.log( 'Error getting filings' );
//       throw new Error( err );
//     }
//     $ = cheerio.load(body)
//     xmlRecurse( $._root, tagSelector);
//     console.log(tags)
//   })
// };

// getTags('http://www.sec.gov/Archives/edgar/data/64803/000006480314000008/cvs-20131231.xml');

// // var attribs = {};
// // var names = {};
// // var temp123 = {};


// // var a = 0;
// // var recursivePrint = function ( el ){
// //   var temp;
// //   if (el.children){
// //     el.children.forEach( function( x ){
// //       recursivePrint( x );
// //       if (!names[x.type]){
// //         names[x.type] = true;
// //       }
// //       if (x.type === 'tag'){
// //         console.log(x)
// //         if (!temp123[x.name]){
// //           temp123[x.name] = true;
// //         }
// //         for (temp in x){
// //           if ( !(attribs[x])) {
// //             attribs[temp] = true;
// //           }
// //         }
// //       }

// //     });
// //   }
// // }

// // var getForms = function(url){
// //   request( url, function ( err, resp, body ){
// //     if ( err )  {
// //       console.log( 'Error getting filings' );
// //       throw new Error( err );
// //     }
// //     var $ = cheerio.load(body)
// //     // // console.log($.xml())
// //     // console.log(body)
// //     // console.log( xmlToJSON.parseString(body))

// //     recursivePrint($._root)
// //     console.log(attribs)
// //     console.log(names)
// //     console.log(temp123);
// //   })

// // };

// // getForms('http://www.sec.gov/Archives/edgar/data/64803/000006480314000008/cvs-20131231.xml');

// // getDocuments('http://www.sec.gov/Archives/edgar/data/64803/000006480314000008/0000064803-14-000008-index.htm', function(x){console.log(x)});

// // searchForms('0000064803', '10-k', 20, 40)
