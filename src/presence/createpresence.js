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

class CreatePresence extends Component {

        constructor(props) {
          super(props);
          this.handlePersonChange = this.handlePersonChange.bind(this);
          this.handleDateChange = this.handleDateChange.bind(this);
          this.handleArrivalChange = this.handleArrivalChange.bind(this);
          this.handleDepartureChange = this.handleDepartureChange.bind(this);
          this.handleMealChange = this.handleMealChange.bind(this);
          this.onSubmit = this.onSubmit.bind(this);

          this.state = {
              personId : '',
              selectedDate : new Date(),
              arrivalTime : new Date(),
              depatureTime : new Date(),
              hasMeal : false,
              peoples: []
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

            // Initialisation des heures
            this.state.arrivalTime.setHours(7);
            this.state.arrivalTime.setMinutes(0);
            this.state.arrivalTime.setSeconds(0);
            this.state.depatureTime.setHours(16);
            this.state.depatureTime.setMinutes(30);
            this.state.arrivalTime.setSeconds(0);

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
                            personId : this.state.personId,
                            presenceDay : this.state.selectedDate,
                            arrival : this.state.arrivalTime,
                            departure : this.state.depatureTime,
                            hasMeal : this.state.hasMeal
                        };
                        axios.put(constants.apiUrl + '/presence/', obj)
                            .then(res => console.log(res.data), this.props.history.push(`/presence/list`))
                            .catch(error => {console.log(error);});

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
                    <h3>Create Presence</h3>
                    <form onSubmit={this.onSubmit}>
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupPerson">Person</label>
                          </div>
                          <select class="custom-select" id="inputGroupPerson" onChange={this.handlePersonChange}>
                            <option selected>Choose...</option>
                            {this.state.peoples.map((people) => (
                                <option value={people.id}>{people.fullname}</option>
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
                                <button type="button" class="btn btn-secondary" onClick={this.handleMealChange} >HasMeal</button>
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