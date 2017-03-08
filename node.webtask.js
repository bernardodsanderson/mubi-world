var admin = require("firebase-admin");
var schedule = require('node-schedule');
var request = require('request');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://mubi-world.firebaseio.com"
// });

var key = "";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "mubi-world",
    clientEmail: "foo@mubi-world.iam.gserviceaccount.com",
    privateKey: key
  }),
  databaseURL: "https://mubi-world.firebaseio.com"
});

// Scheduling
var rule = new schedule.RecurrenceRule();
rule.hour = 6;

// var j = schedule.scheduleJob(rule, function(){
//   updateDatabase();
// });

var db = admin.database();

var refreshToken; // Get refresh token from OAuth2 flow

admin.initializeApp({
  credential: admin.credential.refreshToken(refreshToken),
  databaseURL: "https://mubi-world.firebaseio.com"
});

function updateDatabase() {

  var locations = ['en_CA', 'en_US', 'en_GB', 'en_AU', 'en_NO', 'en_SE', 'en_DK', 'en_IE', 'it_IT', 'en_NZ', 'en_FI'];

  var url = "https://api.justwatch.com/titles/";
  var url2 = "/popular";


  locations.forEach(function(element) {
    // POST request
    request.post(
        url + element + url2,
        { json: { 
          'Content-Type': 'application/json',
          "content_types":null,
          "presentation_types": null,
          "providers": ['mbi'],
          "genres": null,
          "languages": null,
          "release_year_from": null,
          "release_year_until": null,
          "monetization_types": null,
          "min_price": null,
          "max_price": null,
          "scoring_filter_types": null,
          "cinema_release": null,
          "query": null } 
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
              body.items.forEach(function(i) {
                // Update firebase
                db.storeRef('/').set({
                    location: element,
                    titles: i.title
                });
              });
              console.log(element + '--------------------------');
              // body.items.forEach(function(i) {
              //   console.log(i.title);
              // });
            }
        }
    );
  }, this);

}

updateDatabase();