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

class UpdatePresence extends Component {

        constructor(props) {
          super(props);
          this.handlePersonChange = this.handlePersonChange.bind(this);
          this.handleDateChange = this.handleDateChange.bind(this);
          this.handleArrivalChange = this.handleArrivalChange.bind(this);
          this.handleDepartureChange = this.handleDepartureChange.bind(this);
          this.handleMealChange = this.handleMealChange.bind(this);
          this.onSubmit = this.onSubmit.bind(this);

          this.peopleRef = firebase.firestore().collection('peoples');
          this.presenceRef = firebase.firestore().collection('presences').doc(this.props.match.params.id);

          this.state = {
              presenceId : '',
              personId : '',
              selectedDate : new Date(),
              arrivalTime : new Date(),
              depatureTime : new Date(),
              hasMeal : false,
              peoples: [],
              previousPresence: ''
          }
        }


        componentDidMount() {

            var newPeople = [];
            var that = this;

            this.presenceRef.get()
            .then(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                var currentData = doc.data();
                currentData.id = doc.id;

                that.setState({
                    presenceId : doc.id,
                    personId : currentData.personId,
                    selectedDate : new Date(currentData.presenceDay.seconds*1000),
                    arrivalTime : new Date(currentData.arrival.seconds*1000),
                    depatureTime : new Date(currentData.departure.seconds*1000),
                    hasMeal : currentData.hasMeal,
                    previousPresence: ''
                });

                currentData.hasMeal ? that.refs.hasMeal.classList.add('active') : that.refs.hasMeal.classList.remove('active') ;

                console.log(doc.id, " => ", doc.data());
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

                    const obj = {
                            id : this.state.presenceId,
                            personId : this.state.personId,
                            presenceDay : this.state.selectedDate,
                            arrival : this.state.arrivalTime,
                            departure : this.state.depatureTime,
                            hasMeal : this.state.hasMeal
                        };

                    this.presenceRef.set(obj)
                      .then(this.props.history.push(`/presence/list`))
                      .catch(error => {console.log(error);});

      }

        render() {
            return (
                <div style={{marginTop: 10}}>
                    <h3>MàJ Présence</h3>
                    <form onSubmit={this.onSubmit}>
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupPerson">élève</label>
                          </div>
                          <select class="custom-select" id="inputGroupPerson" value={this.state.personId} onChange={this.handlePersonChange}>
                            {this.state.peoples.map((people) => (
                                <option value={people.id} >{people.fullname}</option>
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
                                <button type="button" class="btn btn-secondary" onClick={this.handleMealChange} ref="hasMeal">Repas</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Enregistrer" className="btn btn-primary"/>
                        </div>
                    </form>
                </div>
            )
        }
     };


    export default UpdatePresence