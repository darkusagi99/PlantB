import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';

class ReportPresence extends Component {

        constructor(props) {

                  super(props);

                  this.state = {
                      presenceId : '',
                      personId : '',
                      selectedDate : new Date(),
                      arrivalTime : new Date(),
                      depatureTime : new Date(),
                      hasMeal : false,
                      peoples: [],
                      previousPresence: '',
                      presences: [],
                      peoples: []
                  }

        }

        componentDidMount() {
                    fetch(constants.apiUrl + '/presence/')
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ presences: data })
                    })
                    .catch(console.log)


                    fetch(constants.apiUrl + '/people/')
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ peoples: data })
                    })
                    .catch(console.log)

        }


        getDaysInMonth = () => (new Array(31)).fill('').map((v,i)=>new Date((new Date).getFullYear(),(new Date).getMonth(),i+1)).filter(v=>v.getMonth()===(new Date).getMonth())


        displayFormatedTime(date) {
            var dateToFormat = new Date(date)
            return dateToFormat.getHours() + ":" + dateToFormat.getMinutes().toString().padStart(2,0);
        }

        render() {
            return (
                <div style={{marginTop: 10}}>
                    <h3>Month Report</h3>

                        <table class="table">
                        <thead>
                             <tr>

                                 <th>Peoples</th>
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
                                                        <br />{presence.hasMeal ? ("With Meal") : ("Without Meal")}

                                                        <br /><Link to={'/presence/update/' + presence.id} className="nav-link">Update</Link>
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