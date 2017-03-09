import React from 'react';
import axios from 'axios';
import base from './base';
import { Grid, Cell } from 'react-mdl';

// https://www.justwatch.com/ca/provider/mubi
// const url = "https://api.justwatch.com/titles/en_GB/popular";

// omdb api key = d23f0971
// example (uses imdb number): http://img.omdbapi.com/?i=tt2294629&apikey=d23f0971 and for info: http://www.omdbapi.com/?t=demons+2

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      en_US: [],
      en_CA: [],
      en_GB: [],
      en_AU: [],
      en_NO: [],
      en_SE: [],
      en_DK: [],
      en_IE: [],
      it_IT: [],
      en_NZ: [],
      en_FI: []
    }
  }

  componentDidMount() {

    const locations = ['en_CA', 'en_US', 'en_GB', 'en_AU', 'en_NO', 'en_SE', 'en_DK', 'en_IE', 'it_IT', 'en_NZ', 'en_FI'];
    const full_location = {
      'en_CA': 'Canada', 'en_US': 'US', 'en_GB': 'UK', 'en_AU': 'Australia', 'en_NO': 'Norway', 'en_SE': 'Sweden', 'en_DK': 'Denmark', 'en_IE': 'Ireland', 'it_IT': 'Italy', 'en_NZ': 'New Zealand', 'en_FI': 'Finland'
    };

    const url = "https://api.justwatch.com/titles/";
    const url2 = "/popular";

    let date = new Date();
    let timestamp = date.getHours();

    base.database().ref('en_US').once('value').then(function(snapshot) {
      const dbTimestamp = snapshot.val().timestamp;
      if (Math.abs(dbTimestamp - timestamp) > 6) {
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
            let array_titles = [];
            response.data.items.forEach(function(film){
              array_titles.push(film.title);
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
      }
    });

    this.goThroughFilms();
    
  }

  goThroughFilms() {
    const locations = ['en_CA', 'en_US', 'en_GB', 'en_AU', 'en_NO', 'en_SE', 'en_DK', 'en_IE', 'it_IT', 'en_NZ', 'en_FI'];

    locations.forEach(place => {
      base.database().ref(place).once('value').then((snapshot) => {
        let all_films = snapshot.val();
        let array_films = [];
        all_films.films.map(film => {
          array_films.push(film);
        });
        switch(place) {
          case 'en_US':
            this.setState({en_US: array_films});
            break;
          case 'en_CA':
            this.setState({en_CA: array_films});
            break;
          case 'en_GB':
            this.setState({en_GB: array_films});
            break;
          case 'en_AU':
            this.setState({en_AU: array_films});
            break;
          case 'en_NO':
            this.setState({en_NO: array_films});
            break;
          case 'en_SE':
            this.setState({en_SE: array_films});
            break;
          case 'en_DK':
            this.setState({en_DK: array_films});
            break;
          case 'en_IE':
            this.setState({en_IE: array_films});
            break;
          case 'it_IT':
            this.setState({it_IT: array_films});
            break;
          case 'en_NZ':
            this.setState({en_NZ: array_films});
            break;
          case 'en_FI':
            this.setState({en_FI: array_films});
            break;
          default:
            break;
        }
      });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Mubi.World</h2>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">United States</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_US.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Canada</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_CA.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Great Britain</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_GB.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Australia</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_AU.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">New Zealand</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_NZ.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Ireland</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_IE.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Norway</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_NO.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Sweden</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_SE.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Finland</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_FI.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Denmark</div>
          <Grid className="demo-grid-ruler">
          { this.state.en_DK.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header">Italy</div>
          <Grid className="demo-grid-ruler">
          { this.state.it_IT.map((film, index) => (
            <Cell key={index} col={2}>{film}</Cell>
          ))}
          </Grid>
        </div>

      </div>
    );
  }
}

export default App;
