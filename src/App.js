import React from 'react';
import axios from 'axios';
import base from './base';
import { Grid, Cell, Button, ProgressBar } from 'react-mdl';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
      en_FI: [],
      fr_FR: [],
      es_MX: [],
      de_DE: [],
      loaded: false
    }
  }

  componentWillMount() {

    const locations = ['en_CA', 'en_US', 'en_GB', 'en_AU', 'en_NO', 'en_SE', 'en_DK', 'en_IE', 'it_IT', 'en_NZ', 'en_FI', 'fr_FR', 'es_MX', 'de_DE'];
    const full_location = {
      'en_CA': 'Canada', 'en_US': 'US', 'en_GB': 'UK', 'en_AU': 'Australia', 'en_NO': 'Norway', 'en_SE': 'Sweden', 'en_DK': 'Denmark', 'en_IE': 'Ireland', 'it_IT': 'Italy', 'en_NZ': 'New Zealand', 'en_FI': 'Finland', 'fr_FR': 'France', 'es_MX': 'Mexico', 'de_DE': 'Germany'
    };

    const url = "https://api.justwatch.com/titles/";
    const url2 = "/popular";

    base.auth().onAuthStateChanged(function(user) {
      if (user) {
          // User is signed in
          // console.log(user);
      } else {
          // User is signed out.
          base.auth().signInAnonymously().then(authData => {
            console.log('AUTHED USER: ', authData.uid);
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      }
  });

    base.database().ref('en_US').once('value').then(function(snapshot) {
      // const dbTimestamp = snapshot.val().timestamp;
      if (true) {
        locations.forEach(function(element) {
          // POST request
          axios.options(url+element+url2, {
            'Content-Type': 'application/json',
            'headers': {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
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
            // if (element == 'es_MX') { console.log(response); }
            let storeRef = base.database().ref(element);
            let array_titles = [];
            Object.keys(response.data.items).map(function(objIndex, index) {
              let film = response.data.items[objIndex];
              let credit_director = '';
              // console.log(film);
              if (film.credits !== undefined && film.credits !== null) {
                film.credits.forEach(function(credit) {
                  if(credit.role === 'DIRECTOR') {
                    credit_director = credit.name;
                  }
                });
              } else {
                credit_director = 'No Director';
              }
              if (credit_director === '' || credit_director === undefined) { credit_director = 'No Director'; }
              let poster = '/poster/1234/{profile}';
              if (film.poster !== undefined) { poster = film.poster; }
              array_titles.push([film.title, film.original_release_year, film.full_path, poster, credit_director]);
            });
            storeRef.once("value", (snapshot) => {
              storeRef.set({
                location: full_location[element],
                films: array_titles
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
    const locations = ['en_CA', 'en_US', 'en_GB', 'en_AU', 'en_NO', 'en_SE', 'en_DK', 'en_IE', 'it_IT', 'en_NZ', 'en_FI', 'fr_FR', 'es_MX', 'de_DE'];

    locations.forEach(place => {
      base.database().ref(place).once('value').then((snapshot) => {
        let all_films = snapshot.val();
        let array_films = [];
        all_films.films.forEach(film => {
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
          case 'fr_FR':
            this.setState({fr_FR: array_films});
            break;
          case 'es_MX':
            this.setState({es_MX: array_films});
            break;
          case 'de_DE':
            this.setState({de_DE: array_films});
            break;
          default:
            break;
        }
      });
    });
  }

  // componentDidUpdate(nextProps, nextState) {
    // console.log(nextState.en_US.length);
    // if(this.state.en_US.length > 0) {
      // this.setState({loaded: true});
    // }
  // }

  toMap(data) {
    return (
      data.map((film, index) => (
        <Cell key={index} col={2}><a target="_blank" rel="noopener" href={'https://www.justwatch.com'+film[2]}><img alt={film[3]} src={'https://static.justwatch.com/poster/'+film[3].split(/\//)[2]+'/s276/'+film[2].split(/\//)[3]} /><span>{film[0]}</span>{film[1]}</a></Cell>
      ))
    )
  }

  render() {

    return (
      <div className="App">

        <div className="App-header">
          <h2>MUBI <img alt="logo" src={ require('./mubi.png')} /> WORLD</h2>
        </div>

        <div className="menu">
          <Grid style={{justifyContent: 'center'}}>
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
            <Cell col={1}><a href="#fr"><Button ripple>France</Button></a></Cell>
            <Cell col={1}><a href="#mx"><Button ripple>Mexico</Button></a></Cell>
            <Cell col={1}><a href="#de"><Button ripple>Germany</Button></a></Cell>
          </Grid>
        </div>

        <div className="sticky">
          <a href="#"><i className="material-icons">arrow_upward</i></a>
        </div>

      <ReactCSSTransitionGroup transitionName="films" transitionEnterTimeout={800} transitionLeaveTimeout={500} transitionAppear={true} transitionAppearTimeout={2000}>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="us">United States</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          <div style={{display: this.state.loaded ? 'block' : 'none'}}><ProgressBar indeterminate /></div>
          { this.toMap(this.state.en_US) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="ca">Canada</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_CA) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="gb">Great Britain</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_GB) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="au">Australia</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_AU) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="nz">New Zealand</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_NZ) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="ie">Ireland</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_IE) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="no">Norway</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_NO) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="se">Sweden</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_SE) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="fi">Finland</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_FI) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="dk">Denmark</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.en_DK) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="it">Italy</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.it_IT) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="fr">France</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.fr_FR) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto'}}>
          <div className="location-header" id="de">Germany</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.de_DE) }
          </Grid>
        </div>

        <div style={{width: '80%', margin: 'auto', marginBottom: '150px'}}>
          <div className="location-header" id="mx">Mexico</div>
          <div className="divider"></div>
          <Grid className="demo-grid-ruler">
          { this.toMap(this.state.es_MX) }
          </Grid>
        </div>

      </ReactCSSTransitionGroup>

        <div className="App-header" style={{padding: '20px', fontSize: '10px', marginTop: 0}}>
          mubi.world is not associate with <a href="https://mubi.com">MUBI</a> in any way. Big thanks to <a href="https://www.justwatch.com/">JustWatch</a> for their amazing API.
        </div>

      </div>
    );
  }
}

export default App;
