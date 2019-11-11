import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';
import firebase from '../firebase';

class People extends Component {
                constructor(props) {
                  super(props);

                  this.ref = firebase.firestore().collection('peoples');

                  this.state = { peoples: new Array() };
                }

                componentDidMount() {

                    var newPeople = [];
                    var that = this;

                    this.ref.get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            var currentData = doc.data();
                            currentData.id = doc.id;

                            newPeople.push(currentData);

                            that.setState({
                                peoples: newPeople
                            });

                            console.log(doc.id, " => ", doc.data());
                        });
                    });

                }

                render() {
                    return (
                        <div>
                            <center><h1>Eleves</h1></center>

                            <div>
                                <Link to={'/people/create'} className="nav-link">Ajouter Eleve</Link>
                            </div>

                            <table class="table">
                                <thead>
                                    <tr>
                                          <th scope="col">Nom</th>
                                          <th scope="col">Matin</th>
                                          <th scope="col">Soir</th>
                                          <th scope="col">Repas</th>
                                          <th scope="col">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.peoples.map((people) => (
                                        <tr key={people.id}>
                                            <td>{people.fullname}</td>
                                            <td>Matin : {people.standardArrival.join(' ')}</td>
                                            <td>Soir : {people.standardDeparture.join(' ')}</td>
                                            <td>Repas : {people.standardMeal.join(' ')}</td>
                                            <td><Link to={'/people/update/' + people.id} className="nav-link">Maj Eleve</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    )
                }
     };


    export default People