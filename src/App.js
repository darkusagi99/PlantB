import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import People from './people/peoplelist';
import CreatePeople from './people/createpeople';
import UpdatePeople from './people/updatepeople';
import Presence from './presence/presencelist';
import CreatePresence from './presence/createpresence';
import UpdatePresence from './presence/updatepresence';
import CreateFastPresence from './presence/createpresencefast';
import ReportPresence from './report/monthreport';
import logo from './logo.svg';
import './App.css';

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase';


const firebaseAppAuth = firebase.auth();const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};



class App extends Component {

      render() {

          const {
            user,
            signOut,
            signInWithGoogle,
          } = this.props;

        return (
        <div>

        {
          user
            ? <div>
                    <Router>
                          <div className="container">
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                              <Link to={'/'} className="navbar-brand">Plant B</Link>
                              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                  <li className="nav-item">
                                    <Link to={'/people/list'} className="nav-link">Elèves</Link>
                                  </li>
                                  <li className="nav-item">
                                    <Link to={'/presence/list'} className="nav-link">Présences</Link>
                                  </li>
                                  <li className="nav-item">
                                    <Link to={'/report/month'} className="nav-link">Rapport mensuel</Link>
                                  </li>
                                </ul>
                                <span class="badge badge-pill badge-secondary">v1.1</span>
                                <button  class="btn btn-secondary" onClick={signOut}>Deconnecter</button>
                              </div>
                            </nav> <br/>
                            <Switch>
                                <Route path='/people/create' component={ CreatePeople } />
                                <Route path='/people/list' component={ People } />
                                <Route path='/people/update/:id' component={ UpdatePeople } />
                                <Route path='/presence/create' component={ CreatePresence } />
                                <Route path='/presence/list' component={ Presence } />
                                <Route path='/presence/update/:id' component={ UpdatePresence } />
                                <Route path='/report/month' component={ ReportPresence } />
                                <Route path='/' component={ CreateFastPresence } />
                            </Switch>
                          </div>
                    </Router>
                </div>
            :
             <div className="App">
                    <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <p>Please sign in.</p>
                      <button onClick={signInWithGoogle}>Connexion avec Google</button>
                    </header>
             </div>
        }
        </div>
        );
      }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);


