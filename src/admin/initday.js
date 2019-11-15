import 'date-fns';
import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import firebase from '../firebase';

class InitDay extends Component {

    // Constructeur
    constructor(props) {
        super(props);

        // Bind des méthodes
        this.handleDateChange = this.handleDateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.resetHours = this.resetHours.bind(this);

        // Déclaration firebase
        this.presenceRef = firebase.firestore().collection('presences');

        // Initialisation pour la date du jour
        var presenceDate = new Date();
        presenceDate.setHours(0);
        presenceDate.setMinutes(0);
        presenceDate.setSeconds(0);
        presenceDate.setMilliseconds(0);


        // Initialisation du state
        this.state = {
            selectedDate : presenceDate,
            peoples: [],
            presenceList : []
        }

    }

    // Chargement lors du montage
    componentDidMount() {

        this.resetHours();

    }

    resetHours() {
        // RAZ des heures
        var arrivalDate = new Date(this.state.selectedDate);
        var departureDate = new Date(this.state.selectedDate);
        var baseArrivalDate = new Date(this.state.selectedDate);
        var baseDepartureDate = new Date(this.state.selectedDate);

        arrivalDate.setHours(global.minMorningHour);
        arrivalDate.setMinutes(global.minMorningMinute);
        arrivalDate.setSeconds(0);
        arrivalDate.setMilliseconds(0);
        departureDate.setHours(global.maxEveningHour);
        departureDate.setMinutes(global.maxEveningMinute);
        departureDate.setSeconds(0);
        departureDate.setMilliseconds(0);

        baseArrivalDate.setHours(global.baseMorningHour);
        baseArrivalDate.setMinutes(global.baseMorningMinute);
        baseArrivalDate.setSeconds(0);
        baseArrivalDate.setMilliseconds(0);
        baseDepartureDate.setHours(global.baseEveningHour);
        baseDepartureDate.setMinutes(global.baseEveningMinute);
        baseDepartureDate.setSeconds(0);
        baseDepartureDate.setMilliseconds(0);

        this.setState({
            arrivalTime : arrivalDate,
            depatureTime : departureDate,
            baseArrivalTime : baseArrivalDate,
            baseDepartureTime : baseDepartureDate
        });

    }

    handleDateChange = date => {
        this.setState({
            selectedDate : date
        });

        this.resetHours();
    }

    onSubmit(e) {
        e.preventDefault();

        var peoples = [];
        var presenceList = [];

        // Récupération du nom du jour
        var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        var dayName = days[this.state.selectedDate.getDay()];

        console.log("JOUR => ", dayName);

        // Chargement des personnes
        this.peopleRef.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                var currentData = doc.data();
                currentData.id = doc.id;

                if (currentData.standardArrival.includes(dayName) ||
                        currentData.standardDeparture.includes(dayName) ||
                        currentData.standardMeal.includes(dayName)) {

                    console.log(doc.id, " => ", doc.data());
                    peoples.push(currentData);
                }
            });
        });


        // Chargement des présences
        var that = this;

        // RAZ des heures
        this.resetHours();

        this.presenceRef
        .where("presenceDay", "==", this.state.selectedDate)
        .get()
        .then(function(querySnapshot) {

            // CHargement des présences existantes
            if(!querySnapshot.empty)  {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var currentData = doc.data();
                    currentData.id = doc.id;

                    presenceList.push(currentData.personId);
                });
            }

            // Génération des présences manquantes
            peoples.forEach(function(person) {

                // Recherche si la présence existe déjà
                if(!presenceList.includes(person.id)) {
                    // Si ce n'est pas le cas, création de celle-ci et ajout dans la liste
                    var currentMeal = false;
                    var currentArrival = that.state.baseArrivalTime;
                    var currentDeparture = that.state.baseDepartureTime;

                    if (person.standardArrival.includes(dayName)) {
                        currentArrival = that.state.arrivalTime;
                    }

                    if (person.standardDeparture.includes(dayName)) {
                        currentDeparture = that.state.depatureTime;
                    }

                    if (person.standardMeal.includes(dayName)) {
                        currentMeal = true;
                    }


                    that.presenceRef.add({
                        personId : person.id,
                        presenceDay : that.state.selectedDate,
                        arrival : currentArrival,
                        departure : currentDeparture,
                        hasMeal : currentMeal
                    })
                    .then((docRef) => {
                        that.props.history.push("/presence/list")
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });

                }

            });

        });


    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Initialiser journée</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date"
                            autoOk="true"
                            value={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                            'aria-label': 'change date',
                            }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Générer" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }

};


export default InitDay