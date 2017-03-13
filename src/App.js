import React from 'react';
import axios from 'axios';
import base from './base';
import { Grid, Cell, Button } from 'react-mdl';
// import Scroll from 'react-scroll';

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
    let timestamp = (date.getDay())+'.'+(date.getHours());
    // Math.abs(dbTimestamp - timestamp) > 0.5

    base.auth().signInAnonymously().then(authData => {
      console.log('AUTHED USER: ', authData.uid);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ...
    });

    base.database().ref('en_US').once('value').then(function(snapshot) {
      const dbTimestamp = snapshot.val().timestamp;
      if (Math.abs(dbTimestamp - timestamp) > 0.5) {
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
            let storeRef = base.database().ref(element);
            let array_titles = [];
            response.data.items.forEach(function(film){
              array_titles.push([film.title, film.original_release_year, film.full_path, film.poster]);
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
          <h2>MUBI <img alt="logo" src={ require('./mubi.png')} /> WORLD</h2>
        </div>

        <div className="menu">
          <Grid>
            <Cell col={1}><a href="#us"><Button ripple>US</Button></a></Cell>
            <Cell col={1}><a href="#ca"><Button ripple>Canada</Button></a></Cell>
            <Cell col={1}><a href="#gb"><Button ripple>UK</Button></a></Cell>
            <Cell col={1}><a href="#au"><Button ripple>Australia</Button></a></Cell>
            <Cell col={1}><a href="#nz"><Button ripple>NZ</Button></a></Cell>
            <Cell col={1}><a href="#ie"><Button ripple>Ireland</Button></a></Cell>
            <Cell col={1}><a href="#no"><Button ripple>Norway</Button></a></Cell>
            <Cell col={1}><a href="#se"><Button ripple>Sweden</Button></a></Cell>
            <Cell col={1}><a href="#fi"><Button ripple>Finland</Button></a></Cell>
            <Cell col={1}><a href="#dk"><Button ripple>Denmark</Button></a></Cell>
            <Cell col={1}><a href="#it"><Button ripple>Italy</Button></a></Cell>
          </Grid>
        </div>

        <div className="sticky">
          <a href="#"><i className="material-icons">arrow_upward</i></a>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="us">United States</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_US.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="ca">Canada</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_CA.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="gb">Great Britain</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_GB.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="au">Australia</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_AU.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="nz">New Zealand</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_NZ.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="ie">Ireland</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_IE.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="no">Norway</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_NO.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="se">Sweden</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_SE.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="fi">Finland</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_FI.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="dk">Denmark</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.en_DK.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto', marginBottom: '150px'}}>
          <div className="location-header" id="it">Italy</div>
          <hr/>
          <Grid className="demo-grid-ruler">
          { this.state.it_IT.map((film, index) => (
            <Cell key={index} col={2}><a target="_blank" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
          ))}
          </Grid>
        </div>

        <div className="App-header" style={{padding: '20px', fontSize: '10px', marginTop: 0}}>
          mubi.world is not associate with <a href="https://mubi.com">MUBI</a> in any way. Big thanks to <a href="https://www.justwatch.com/">JustWatch</a> for their amazing API.
        </div>

      </div>
    );
  }
}

export default App;
