var admin = require("firebase-admin");
var schedule = require('node-schedule');
var request = require('request');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://mubi-world.firebaseio.com"
// });

var key = "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDf25MaAUnDFlKW\nWnUagHGHHtONZ6zgAE19EEp6e9eKgZWEUBo4vD/7L5DbcAhWbhwIaZgsxS7vQje3\nagBOrkPejUBfuN1tHtIjGFsQb5+atPsiT/rwfNSEzteAES3g12C51hHgtPOtgE5J\nQcmjFCFHparuTXHuyG/1r8e+hXmaUgHDKgXTSEce8I4AdeBxB71Eby7usMBNCWoy\nKB05eHQKcFGdO+Cu5XBv7bOnhl6dLybGHpLE8L5wk+LBRMwD0RhLmZxH4p7LkZbY\nylGM9j1pES4xSbxSEn7t6z7NO4romS8JK6oo8WShQG9iykBV7gyB3YtWtZqUBX5k\nRTId022rAgMBAAECggEAMqGwQNZ/v39CCL3G9MqOYvhm8vm7ESMgY6QWpGN0WeB7\nV+TiOWjis8aLZgaN7DaVYpW3lJC4z+bTQUnZbfJeaWzbXYsrke3Bq6xrlGka2VwL\n3TPn1xL04mECPvYjwVIVj5LKkl97Kgf2LP2TRK5d5J2k7qdXmKF/KTur2vzHh06O\nyMItSN/RDWf1bvz0UEce6dDqIEQ4GoonNuiICCEiFzR7PATMXduiZT1rWd/Me2DO\nPLsj+nsrrSezI34j+B/OiSDYqh2cQYYVfXcW6TOWoPS7Pkfd6F156OonpJGVZuoL\n8LfvWvssIjiwNXbUlE3yuVhV6G1DqnfZSYT6z2Q8EQKBgQDydIdhf7KOrNVUUn5S\nc72RfXwT+L7IkhYqFdNjd3sEA5ZPbIhDA5ybNLQAxfucxBU4F5LQXhqtKkNckyHQ\nbWWtYc3A52gbBLX9HfZj5UgqFV6DLS3iJGfBUPIWJyPUxXvFH0LsgD1072JwQxm8\nF8NDapouXetSsDsl2JSy1q4GuQKBgQDsXRL33OIb5wbz2yPL3Y5wFTjp25E2UpST\n+ZZR4b9dIIXb+rau8gqjPEyiXYqUD56BzLGRxk4CEi+RKTFGVF0s5WuYUPtzF1l8\nESK1rSnSPhGvyFEKwZTwy8rY2McKqt7Guq01U9OklCpBZ7lS4ay6WqbEfryis9a3\nO7SRO5dlgwKBgQDn+mjB971vV5yxllB5MXZyqx65uSlJnMUKNWHRbLNN7uS1T4G8\npMsFkVKc3tFUeCRZS+zT4wYhIyvaeohC9TjwwIBuDrsEBujdqvphMDJw2YtZdTPO\niMihJYLLgV1+Kgm3XKbaxASJSrXj9b+8wPu6GFg2/vO2ZRnipyv3RQKzOQKBgQCA\n95v08GnTTbBmeEjE4OPqVjoSqAJIwLBfOU0C6olO2AMR72+kb17MiIdMBHwro4Ya\nTsUIxEomKSQZMX+4Xynj6F5X4sAAoVnrLzJgLNbn54QhBMzrcIrDBH9u6IFaWbdq\necsukMmnQEz6GQ1uosJrgDEEgB6PLE9Y9VPl9rz53wKBgQCCqEl6f4R6ZlUh3382\nFseQiD2bLybx4Aort4J2xFH6XIcfiyFXxCEq71baASk1lpy20uC+U5lP/kudTew2\nWEzvnbE6L04KYgDLmnJFdEKA+s8fP5Bv0Ez/8N0b+4P9WIgqw363Z65bpC3y06ki\npIBGsT8JTTWw2WMYlDK3qubY6Q==\n-----END PRIVATE KEY-----\n";

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