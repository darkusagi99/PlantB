import 'date-fns';
import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { Link } from 'react-router-dom';
import firebase from '../firebase';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class ReportPresence extends Component {

    // Constructeur
    constructor(props) {

        super(props);

        // Bind des méthodes
        this.handleDateChange = this.handleDateChange.bind(this);
        this.peopleRef = firebase.firestore().collection('peoples');
        this.presenceRef = firebase.firestore().collection('presences');

        // Déclaration du state
        this.state = {
            selectedDate : new Date(),
            peoples: [],
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

    handleDateChange = date => {

        var that = this;
        var newPresence = [];

        console.log("SearchDate => ", Math.round((date).getTime() / 1000));

        this.presenceRef
        .where("presenceDay", ">=", new Date(date.getFullYear(),date.getMonth(),1))
        .where("presenceDay", "<=", new Date(date.getFullYear(),date.getMonth(),31))
        .get()
        .then(function(querySnapshot) {
            if(!querySnapshot.empty)  {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var currentData = doc.data();
                    currentData.id = doc.id;


                    console.log(" => ", that.state.selectedDate.getTime());
                    console.log(" => ", currentData.presenceDay.seconds*1000);

                    var currentDate = new Date(currentData.presenceDay.seconds*1000);

                    currentData.presenceDay = new Date(currentData.presenceDay.seconds*1000);
                    currentData.arrival = new Date(currentData.arrival.seconds*1000);
                    currentData.departure = new Date(currentData.departure.seconds*1000);


                    console.log("currentDate.getFullYear() => ", currentDate.getFullYear());
                    console.log("currentDate.getMonth() => ", currentDate.getMonth());
                    console.log("date.getFullYear() => ", date.getFullYear());
                    console.log("date.getMonth() => ", date.getMonth());

                    newPresence.push(currentData);

                    that.setState({
                        presences : newPresence
                    });

                    console.log(doc.id, " => ", doc.data());

                });
            }
        });

        this.setState({
            selectedDate : date,
            presences : newPresence
        });
    }


    getDaysInMonth(refDate) {
        return (new Array(31)).fill('')
            .map((v,i)=>new Date(refDate.getFullYear(),refDate.getMonth(),i+1))
            .filter(v=>v.getMonth()===refDate.getMonth())
    }


    displayFormatedTime(date) {
        var dateToFormat = new Date(date)
        return dateToFormat.getHours() + ":" + dateToFormat.getMinutes().toString().padStart(2,0);
    }

    isUnworkedDay(date) {
        switch (date.getDay()) {
          case 0:
          case 3:
          case 6:
            return "table-secondary";
          default:
            break;
        }
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Rapport Mensuel</h3>

                <div style={{marginTop: 10}}>
                    <h4>Filtres</h4>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/yyyy"
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
                    </form>
                </div>

                <table className="table table-striped">
                <thead>
                     <tr>

                         <th>Elève</th>
                         {(this.getDaysInMonth(this.state.selectedDate)).map((dayInMonth) => (
                            <th className={this.isUnworkedDay(dayInMonth)} key={dayInMonth.getTime()}>{dayInMonth.getDate()}</th>
                         ))}
                     </tr>
                </thead>
                <tbody>

                    {this.state.peoples.map((people) => (
                         <tr key={people.id}>
                            <td>{people.fullname}</td>
                            {(this.getDaysInMonth(this.state.selectedDate)).map((dayInMonth) => (
                                     <td className={this.isUnworkedDay(dayInMonth)} key={dayInMonth.getTime()}>{this.state.presences
                                        .filter((presence) => (people.id === presence.personId))
                                        .filter((presence) => (dayInMonth.getFullYear() === new Date(presence.presenceDay).getFullYear()
                                                                && dayInMonth.getMonth() === new Date(presence.presenceDay).getMonth()
                                                                && dayInMonth.getDate() === new Date(presence.presenceDay).getDate()))
                                        .map((presence) => (
                                                <p key={presence.id}>
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