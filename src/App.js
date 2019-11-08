import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Users from './user/userlist';
import CreateUser from './user/createuser';
import UpdateUser from './user/updateuser';
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

class App extends Component {

      render() {
        return (
          <Router>
            <div className="container">
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link to={'/'} className="navbar-brand">TimeManager</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                      <Link to={'/user/list'} className="nav-link">Users</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/people/list'} className="nav-link">People</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/presence/list'} className="nav-link">Presence</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/report/month'} className="nav-link">Month Report</Link>
                    </li>
                  </ul>
                </div>
              </nav> <br/>
              <Switch>
                  <Route path='/user/create' component={ CreateUser } />
                  <Route path='/user/list' component={ Users } />
                  <Route path='/user/update/:id' component={ UpdateUser } />
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
        );
      }
}

    export default App;
