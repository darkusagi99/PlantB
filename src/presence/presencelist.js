import 'date-fns';
import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { Link } from 'react-router-dom';
import firebase from '../firebase';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class Presence extends Component {

    // Constructeur
    constructor(props) {
        super(props);

        // Bind des méthodes
        this.handlePersonChange = this.handlePersonChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.displayFormatedDate = this.displayFormatedDate.bind(this);
        this.displayFormatedTime = this.displayFormatedTime.bind(this);

        // Initialisations firebase
        this.peopleRef = firebase.firestore().collection('peoples');
        this.presenceRef = firebase.firestore().collection('presences');


        // Initialisation state
        this.state = {
            presences: [],
            peoples: [],
            selectedDate: '',
            selectedPersonId: ''
        };
    }

    // Méthodes pour le chargement des présences
    componentDidMount() {

        var newPresence = [];
        var newPeople = [];
        var that = this;

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

    handlePersonChange = e => {

        var that = this;
        var newPresence = [];

        this.presenceRef
        .where("personId", "==", e.target.value)
        //.where("presenceDay.seconds", "==", 1573426800)
        .get()
        .then(function(querySnapshot) {
            if(!querySnapshot.empty) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var currentData = doc.data();
                    currentData.id = doc.id;



                    if(that.state.selectedDate !== '') {
                        if (that.state.selectedDate.getTime() == currentData.presenceDay.seconds*1000) {

                            newPresence.push(currentData);

                            that.setState({
                            presences : newPresence
                            });

                            console.log(doc.id, " => ", doc.data());

                        }
                    } else {

                        newPresence.push(currentData);

                        that.setState({
                        presences : newPresence
                        });

                        console.log(doc.id, " => ", doc.data());

                    }

                });
            }
        });

        this.setState({
            selectedPersonId : e.target.value,
            presences : newPresence
        });

    }

    handleDateChange = date => {

        var that = this;
        var newPresence = [];

        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        console.log("SearchDate => ", Math.round((date).getTime() / 1000));

        var presenceRefPerson;

        if (this.state.selectedPersonId === '') {
            presenceRefPerson = this.presenceRef;
        } else {
            presenceRefPerson = this.presenceRef.where("personId", "==", this.state.selectedPersonId);
        }

        presenceRefPerson
        .get()
        .then(function(querySnapshot) {
            if(!querySnapshot.empty)  {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var currentData = doc.data();
                    currentData.id = doc.id;

                    console.log(" => ", that.state.selectedDate.getTime());
                    console.log(" => ", currentData.presenceDay.seconds*1000);

                    if(that.state.selectedDate.getTime() == currentData.presenceDay.seconds*1000) {

                        newPresence.push(currentData);

                        that.setState({
                            presences : newPresence
                        });

                        console.log(doc.id, " => ", doc.data());

                    }
                });
            }
        });

        this.setState({
            selectedDate : date,
            presences : newPresence
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
        return dateToFormat.toLocaleDateString("fr-FR");
    }

    // Rendu de la page
    render() {
        return (
            <div>
                <center><h1>Présences</h1></center>

                <div>
                    <Link to={'/presence/create'} className="nav-link">Création Présence</Link>
                </div>

                <div style={{marginTop: 10}}>
                    <h4>Filtres</h4>
                    <form onSubmit={this.onSubmit}>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="inputGroupPerson">Eleve</label>
                            </div>

                            <select class="custom-select" id="inputGroupPerson" value={this.state.personId} onChange={this.handlePersonChange}>

                                <option value="">Choix...</option>
                                {this.state.peoples.map((people) => (
                                    <option value={people.id} key={people.id}>{people.fullname}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label=""
                                autoOk="true"
                                value={this.state.selectedDate}
                                onChange={this.handleDateChange}
                                KeyboardButtonProps={{
                                'aria-label': 'change date',
                                }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </form>
                </div>

                <table class="table table-striped">
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
                                <td>{this.state.peoples.filter((people) => (people.id === presence.personId)).map((people) => people.fullname)}</td>
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