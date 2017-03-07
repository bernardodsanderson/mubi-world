import React, { Component } from 'react';
import axios from 'axios';
import base from './base';

// https://www.justwatch.com/ca/provider/mubi
// const url = "https://api.justwatch.com/titles/en_GB/popular";

class App extends Component {

  constructor() {
    super();
    this.state = {
      location: null,
      films: null
    }
  }

  componentDidMount() {

    const locations = ['en_CA', 'en_US', 'en_GB', 'en_AU', 'en_NO', 'en_SE', 'en_DK', 'en_IE', 'it_IT', 'en_NZ', 'en_FI'];

    const full_location = {
      'en_CA': 'Canada', 'en_US': 'US', 'en_GB': 'UK', 'en_AU': 'Australia', 'en_NO': 'Norway', 'en_SE': 'Sweden', 'en_DK': 'Denmark', 'en_IE': 'Ireland', 'it_IT': 'Italy', 'en_NZ': 'New Zealand', 'en_FI': 'Finland'
    };

    const url = "https://api.justwatch.com/titles/";
    const url2 = "/popular";


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
          let storeRef = base.database().ref(element);
          storeRef.once("value", (snapshot) => {
            storeRef.set({
              location: full_location[element],
              films: response.data.items
            })
          });
          // console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, this);
    
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Mubi.World</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>{this.state.location}</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
