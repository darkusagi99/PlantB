import 'date-fns';
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from 'axios';
import {constants} from '../common';

class CreateFastPresence extends Component {
        constructor(props) {
                  super(props);
                  this.handlePersonChange = this.handlePersonChange.bind(this);
                  this.handleDateChange = this.handleDateChange.bind(this);
                  this.handleArrivalChange = this.handleArrivalChange.bind(this);
                  this.handleDepartureChange = this.handleDepartureChange.bind(this);
                  this.handleMealChange = this.handleMealChange.bind(this);
                  this.onSubmit = this.onSubmit.bind(this);

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

                    // Chargement liste personnes
                    fetch(constants.apiUrl + '/people/')
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ peoples: data })
                    })
                    .catch(console.log)

                }



              handlePersonChange = e => {

                  // Chargement liste personnes
                  fetch(constants.apiUrl + '/presenceSearch/' + e.target.value + '/' + this.state.selectedDate.toISOString().slice(0,10))
                  .then(res => res.json())
                  .then((data) => {
                      this.setState({
                            previousPresence: data,
                            arrivalTime: data.arrival,
                            depatureTime: data.departure,
                            hasMeal: data.hasMeal,
                            presenceId: data.id
                       })
                  })
                  .catch(console.log)

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
                                axios.post(constants.apiUrl + '/presence/', obj)
                                    .then(res => console.log(res.data), this.props.history.push(`/presence/list`))
                                    .catch(error => {console.log(error);});

              }

                render() {
                    return (
                        <div style={{marginTop: 10}}>
                            <h3>Update Presence</h3>
                            <form onSubmit={this.onSubmit}>
                                <div class="input-group mb-3">
                                  <div class="input-group-prepend">
                                    <label class="input-group-text" for="inputGroupPerson">Person</label>
                                  </div>
                                  <select class="custom-select" id="inputGroupPerson" value={this.state.personId} onChange={this.handlePersonChange}>

                                    <option selected>Choose...</option>
                                    {this.state.peoples.map((people) => (
                                        <option value={people.id} >{people.fullname}</option>
                                     ))}
                                  </select>
                                </div>
                                <div className="form-group">
                                    <p>{this.state.selectedDate.toLocaleDateString()}</p>
                                </div>
                                <div className="form-group">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardTimePicker
                                              margin="normal"
                                              id="time-picker"
                                              label="Arrival"
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
                                              label="Departure"
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
                                        <button type="button" class="btn btn-secondary" onClick={this.handleMealChange} ref="hasMeal">HasMeal</button>
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


    export default CreateFastPresence