const functions = require('firebase-functions');
const admin = require('firebase-admin');
const schedule = require('node-schedule');
const axios = require('axios');

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions

admin.initializeApp(functions.config().firebase);

const locations = ['en_CA', 'en_US', 'en_GB', 'en_AU', 'en_NO', 'en_SE', 'en_DK', 'en_IE', 'it_IT', 'en_NZ', 'en_FI'];
const full_location = {
  'en_CA': 'Canada', 'en_US': 'US', 'en_GB': 'UK', 'en_AU': 'Australia', 'en_NO': 'Norway', 'en_SE': 'Sweden', 'en_DK': 'Denmark', 'en_IE': 'Ireland', 'it_IT': 'Italy', 'en_NZ': 'New Zealand', 'en_FI': 'Finland'
};

const url = "https://api.justwatch.com/titles/";
const url2 = "/popular";

let date = new Date();
let timestamp = (date.getDay())+'.'+(date.getHours());
// Math.abs(dbTimestamp - timestamp) > 0.5

admin.auth().onAuthStateChanged(function(user) {
  if (user) {
      // User is signed in
      console.log(user);
  } else {
      // User is signed out.
      admin.auth().signInAnonymously().then(authData => {
        console.log('AUTHED USER: ', authData.uid);
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ...
      });
  }
  // ...
});

admin.database().ref('en_US').once('value').then(function(snapshot) {
  const dbTimestamp = snapshot.val().timestamp;
    locations.forEach(function(element) {
      // POST request
      axios.post(url+element+url2, {
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
        "query": null
      })
      .then(function (response) {
        // console.log(response);
        let storeRef = admin.database().ref(element);
        let array_titles = [];
        response.data.items.forEach(function(film) {
          let credit_director = '';
          if (film.credits !== undefined) {
            film.credits.forEach(function(credit) {
              if(credit.role === 'DIRECTOR') {
                credit_director = credit.name;
              }
            });
          } else {
            credit_director = 'No Director';
          }
          if (credit_director === '') { credit_director = 'No Director'; }
          array_titles.push([film.title, film.original_release_year, film.full_path, film.poster, credit_director]);
        });
        storeRef.once("value", (snapshot) => {
          storeRef.set({
            location: full_location[element],
            films: array_titles,
            timestamp: timestamp
          })
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }, this);
});

// Scheduling
var rule = new schedule.RecurrenceRule();
rule.hour = 6;

// var j = schedule.scheduleJob(rule, function(){
//   updateDatabase();
// });

exports.mubi = functions.database.ref('/')
  .onWrite(event => {
    const original = event.data.val();
  })
