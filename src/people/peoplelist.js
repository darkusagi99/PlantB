import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';

class People extends Component {
                constructor(props) {
                  super(props);
                  this.state = { peoples: [] };
                }

                componentDidMount() {
                    fetch(constants.apiUrl + '/people/')
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ peoples: data })
                    })
                    .catch(console.log)
                }

                componentDidUpdate() {
                    fetch(constants.apiUrl + '/people/')
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ peoples: data })
                    })
                    .catch(console.log)
                }

                render() {
                    return (
                        <div>
                            <center><h1>People </h1></center>

                            <div>
                                <Link to={'/people/create'} className="nav-link">Create People</Link>
                            </div>

                            <table class="table">
                                <thead>
                                    <tr>
                                          <th scope="col">name</th>
                                          <th scope="col">morning</th>
                                          <th scope="col">evening</th>
                                          <th scope="col">meal</th>
                                          <th scope="col">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.peoples.map((people) => (
                                        <tr>
                                            <td>{people.fullname}</td>
                                            <td>Morning : {people.standardArrival.join(' ')}</td>
                                            <td>Evening : {people.standardDeparture.join(' ')}</td>
                                            <td>Meal : {people.standardMeal.join(' ')}</td>
                                            <td><Link to={'/people/update/' + people.id} className="nav-link">Update People</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    )
                }
     };


    export default People