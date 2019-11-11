import 'date-fns';
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {constants} from '../common';
import firebase from '../firebase';

class CreatePresence extends Component {

        constructor(props) {
          super(props);

          var newPeople = [];

          this.handlePersonChange = this.handlePersonChange.bind(this);
          this.handleDateChange = this.handleDateChange.bind(this);
          this.handleArrivalChange = this.handleArrivalChange.bind(this);
          this.handleDepartureChange = this.handleDepartureChange.bind(this);
          this.handleMealChange = this.handleMealChange.bind(this);
          this.onSubmit = this.onSubmit.bind(this);


          this.peopleRef = firebase.firestore().collection('peoples');
          this.presenceRef = firebase.firestore().collection('presences');


          this.state = {
              personId : '',
              selectedDate : new Date(),
              arrivalTime : new Date(),
              depatureTime : new Date(),
              hasMeal : false,
              peoples: newPeople
          }
        }


        componentDidMount() {

            var newPeople = [];
            var that = this;

            // Chargement liste personnes
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

            // Initialisation des heures
            this.state.selectedDate.setHours(0);
            this.state.selectedDate.setMinutes(0);
            this.state.selectedDate.setSeconds(0);
            this.state.selectedDate.setMilliseconds(0);
            this.state.arrivalTime.setHours(7);
            this.state.arrivalTime.setMinutes(0);
            this.state.arrivalTime.setSeconds(0);
            this.state.arrivalTime.setMilliseconds(0);
            this.state.depatureTime.setHours(16);
            this.state.depatureTime.setMinutes(30);
            this.state.arrivalTime.setSeconds(0);
            this.state.arrivalTime.setMilliseconds(0);

        }



      handlePersonChange = e => {
          this.setState({
                    personId : e.target.value
          });
      }

      handleDateChange = date => {
          this.setState({
                    selectedDate : date
          });
      }

      handleArrivalChange = date => {
          this.setState({
                    arrivalTime : date
          });
      }

      handleDepartureChange = date => {
          this.setState({
                    depatureTime : date
          });
      }

      handleMealChange(e) {
                const item = e.target.value;
                e.target.classList.toggle('active');
                const active = e.target.classList.contains('active');
                this.state.hasMeal = active;
      }

      onSubmit(e) {
                    e.preventDefault();

                    this.presenceRef.add({
                        personId : this.state.personId,
                        presenceDay : this.state.selectedDate,
                        arrival : this.state.arrivalTime,
                        departure : this.state.depatureTime,
                        hasMeal : this.state.hasMeal
                    })
                    .then((docRef) => {
                        this.props.history.push("/presence/list")
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });

                    this.setState({
                            personId : '',
                            selectedDate : new Date(),
                            arrivalTime : new Date(),
                            depatureTime : new Date(),
                            hasMeal : false
                    })
            }

        render() {
            return (
                <div style={{marginTop: 10}}>
                    <h3>Creation Presence</h3>
                    <form onSubmit={this.onSubmit}>
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupPerson">Eleve</label>
                          </div>
                          <select class="custom-select" id="inputGroupPerson" onChange={this.handlePersonChange}>
                            <option value="">Choose...</option>
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
                                      format="MM/dd/yyyy"
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
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                      margin="normal"
                                      id="time-picker"
                                      label="Arrive"
                                      ampm={false}
                                      value={this.state.arrivalTime}
                                      onChange={this.handleArrivalChange}
                                      KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                      }}
                                    />
                                </MuiPickersUtilsProvider>
                        </div>
                        <div className="form-group">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                      margin="normal"
                                      id="time-picker"
                                      label="Depart"
                                      ampm={false}
                                      value={this.state.depatureTime}
                                      onChange={this.handleDepartureChange}
                                      KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                      }}
                                    />
                                </MuiPickersUtilsProvider>
                        </div>
                        <div className="form-group">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <button type="button" class="btn btn-secondary" onClick={this.handleMealChange} >Repas</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Save" className="btn btn-primary"/>
                        </div>
                    </form>
                </div>
            )
        }
     };


    export default CreatePresence