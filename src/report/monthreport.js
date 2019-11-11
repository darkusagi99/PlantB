import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';
import firebase from '../firebase';

class ReportPresence extends Component {

        constructor(props) {

                  super(props);

                  this.peopleRef = firebase.firestore().collection('peoples');
                  this.presenceRef = firebase.firestore().collection('presences');

                  this.state = {
                      presenceId : '',
                      personId : '',
                      selectedDate : new Date(),
                      arrivalTime : new Date(),
                      depatureTime : new Date(),
                      hasMeal : false,
                      peoples: [],
                      previousPresence: '',
                      presences: []
                  }

        }

        componentDidMount() {
                    var newPeople = [];
                    var newPresence = [];
                    var that = this;

                    this.presenceRef.get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            var currentData = doc.data();
                            currentData.id = doc.id;

                            currentData.presenceDay = new Date(currentData.presenceDay.seconds*1000);
                            currentData.arrival = new Date(currentData.arrival.seconds*1000);
                            currentData.departure = new Date(currentData.departure.seconds*1000);

                            newPresence.push(currentData);

                            that.setState({
                                presences : newPresence,
                                peoples : newPeople
                            });

                            console.log(doc.id, " => ", doc.data());
                        });
                    });


                    this.peopleRef.get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            var currentData = doc.data();
                            currentData.id = doc.id;

                            newPeople.push(currentData);

                            that.setState({
                                presences : newPresence,
                                peoples : newPeople
                            });

                            console.log(doc.id, " => ", doc.data());
                        });
                    });

        }


        getDaysInMonth = () => (new Array(31)).fill('').map((v,i)=>new Date((new Date).getFullYear(),(new Date).getMonth(),i+1)).filter(v=>v.getMonth()===(new Date).getMonth())


        displayFormatedTime(date) {
            var dateToFormat = new Date(date)
            return dateToFormat.getHours() + ":" + dateToFormat.getMinutes().toString().padStart(2,0);
        }

        render() {
            return (
                <div style={{marginTop: 10}}>
                    <h3>Rapport Mensuel</h3>

                        <table class="table">
                        <thead>
                             <tr>

                                 <th>Elève</th>
                                 {this.getDaysInMonth().map((dayInMonth) => (
                                    <th>{dayInMonth.getDate()}</th>
                                 ))}
                             </tr>
                        </thead>
                        <tbody>

                        {this.state.peoples.map((people) => (
                             <tr>
                                <td>{people.fullname}</td>
                                {this.getDaysInMonth().map((dayInMonth) => (
                                         <td>{this.state.presences
                                            .filter((presence) => (people.id == presence.personId))
                                            .filter((presence) => (dayInMonth.getFullYear() == new Date(presence.presenceDay).getFullYear()))
                                            .filter((presence) => (dayInMonth.getMonth() == new Date(presence.presenceDay).getMonth()))
                                            .filter((presence) => (dayInMonth.getDate() == new Date(presence.presenceDay).getDate()))
                                            .map((presence) => (
                                                    <p>
                                                        {presence.arrival ? (this.displayFormatedTime(presence.arrival)) : ("-")}-{presence.departure ? (this.displayFormatedTime(presence.departure)) : ("-")}
                                                        <br />{presence.hasMeal ? ("Avec Repas") : ("Sans Repas")}

                                                        <br /><Link to={'/presence/update/' + presence.id} className="nav-link">MàJ</Link>
                                                    </p>
                                                )
                                            )}
                                         </td>
                                ))}
                             </tr>
                        ))}

                        </tbody>
                        </table>

                </div>
            )
        }
     };


    export default ReportPresence