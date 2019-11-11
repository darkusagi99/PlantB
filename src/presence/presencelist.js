import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';
import firebase from '../firebase';

class Presence extends Component {

    // Constructeur
    constructor(props) {
        super(props);

        // Bind des méthodes
        this.displayFormatedDate = this.displayFormatedDate.bind(this);
        this.displayFormatedTime = this.displayFormatedTime.bind(this);

        // Initialisations firebase
        this.peopleRef = firebase.firestore().collection('peoples');
        this.presenceRef = firebase.firestore().collection('presences');

        // Initialisation state
        this.state = {
            presences: [],
            peoples: []
        };
    }

    // Méthodes pour le chargement des présences
    componentDidMount() {

        var newPresence = [];
        var newPeople = [];
        var that = this;

        // Chargement des présences
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

        // Chargement des personnes
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

    // Affichage de la date formattée
    displayFormatedTime(date) {
        var dateToFormat = new Date(date.seconds*1000)
        return dateToFormat.getHours() + ":" + dateToFormat.getMinutes().toString().padStart(2,0);
    }

    // Affichage de l'heure formattée
    displayFormatedDate(date) {
        var dateToFormat = new Date(date.seconds*1000)
        return dateToFormat.toLocaleDateString();
    }

    // Rendu de la page
    render() {
        return (
            <div>
                <center><h1>Présences</h1></center>

                <div>
                    <Link to={'/presence/create'} className="nav-link">Création Présence</Link>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Jour</th>
                            <th scope="col">Arrivé</th>
                            <th scope="col">Départ</th>
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
                                <td>{presence.hasMeal ? ("Avec Repas") : ("Sans Repas")}</td>

                                <td><Link to={'/presence/update/' + presence.id} className="nav-link">MàJ Présence</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        )
    }

};


export default Presence