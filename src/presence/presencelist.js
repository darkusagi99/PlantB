import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';
import firebase from '../firebase';

class Presence extends Component {

        constructor(props) {
          super(props);
          this.displayFormatedDate = this.displayFormatedDate.bind(this);
          this.displayFormatedTime = this.displayFormatedTime.bind(this);

          this.peopleRef = firebase.firestore().collection('peoples');
          this.presenceRef = firebase.firestore().collection('presences');

          this.state = { presences: [],
                        peoples: []};
        }

        componentDidMount() {

            var newPresence = [];
            var newPeople = [];
            var that = this;

            this.presenceRef.get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var currentData = doc.data();
                    currentData.id = doc.id;

                    newPresence.push(currentData);

                    that.setState({
                        presences : newPresence
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
                        peoples: newPeople
                    });

                    console.log(doc.id, " => ", doc.data());
                });
            });

        }

        displayFormatedTime(date) {
            var dateToFormat = new Date(date.seconds*1000)
            return dateToFormat.getHours() + ":" + dateToFormat.getMinutes().toString().padStart(2,0);
        }

        displayFormatedDate(date) {
            var dateToFormat = new Date(date.seconds*1000)
            return dateToFormat.toLocaleDateString();
        }

        render() {
            return (
                <div>
                    <center><h1>Presence</h1></center>

                    <div>
                        <Link to={'/presence/create'} className="nav-link">Create Presence</Link>
                    </div>

                     <table class="table">
                     <thead>
                         <tr>
                               <th scope="col">Nom</th>
                               <th scope="col">Jour</th>
                               <th scope="col">Arrive</th>
                               <th scope="col">Depart</th>
                               <th scope="col">Repas</th>
                               <th scope="col">&nbsp;</th>
                         </tr>
                     </thead>
                     <tbody>
                     {this.state.presences.map((presence) => (
                         <tr key={presence.id}>
                             <td>{this.state.peoples.filter((people) => (people.id == presence.personId)).map((people) => people.fullname)}</td>
                             <td>{presence.presenceDay ? (this.displayFormatedDate(presence.presenceDay)) : ("-")}</td>
                             <td>{presence.arrival ? (this.displayFormatedTime(presence.arrival)) : ("-")}</td>
                             <td>{presence.departure ? (this.displayFormatedTime(presence.departure)) : ("-")}</td>
                             <td>{presence.hasMeal ? ("Avec Meal") : ("Sans Meal")}</td>

                             <td><Link to={'/presence/update/' + presence.id} className="nav-link">Update Presence</Link></td>
                         </tr>
                     ))}
                     </tbody>
                     </table>


                </div>
            )
        }
     };


    export default Presence