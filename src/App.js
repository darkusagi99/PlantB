import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import People from './people/peoplelist';
import UpdatePeople from './people/updatepeople';
import Presence from './presence/presencelist';
import CreateFastPresence from './presence/createpresencefast';
import ReportPresence from './report/monthreport';
import InitDay from './admin/initday';
import logo from './logo.svg';
import './App.css';

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';


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
                            <Navbar bg="light" expand="lg">
                              <Navbar.Brand href="/">PlantB</Navbar.Brand>
                              <Navbar.Toggle aria-controls="basic-navbar-nav" />
                              <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                  <Nav.Link href="/people/list">Elèves</Nav.Link>
                                  <Nav.Link href="/presence/list">Présences</Nav.Link>
                                  <Nav.Link href="/report/month">Rapport mensuel</Nav.Link>
                                  <Nav.Link href="/admin/initday">Initialiser journée</Nav.Link>
                                </Nav>
                                <Nav>
                                  <Button className="btn btn-secondary" onClick={signOut}>Deconnecter</Button>
                                </Nav>
                              </Navbar.Collapse>
                            </Navbar> <br/>
                            <Switch>
                                <Route path='/people/create' component={ UpdatePeople } />
                                <Route path='/people/list' component={ People } />
                                <Route path='/people/update/:id' component={ UpdatePeople } />
                                <Route path='/presence/create' component={ CreateFastPresence } />
                                <Route path='/presence/list' component={ Presence } />
                                <Route path='/presence/update/:id' component={ CreateFastPresence } />
                                <Route path='/report/month' component={ ReportPresence } />
                                <Route path='/admin/initday' component={ InitDay } />
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


