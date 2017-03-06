import React, { Component } from 'react';
import axios from 'axios';

// https://www.justwatch.com/ca/provider/mubi

class App extends Component {

  componentDidMount() {
    const url = "https://api.justwatch.com/titles/en_CA/popular";
    axios.post(url, { 
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
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
