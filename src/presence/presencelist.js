import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';

class Presence extends Component {

        constructor(props) {
          super(props);
          this.displayFormatedTime = this.displayFormatedTime.bind(this);
          this.state = { presences: [],
                        peoples: []};
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

        componentDidUpdate() {
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

        displayFormatedTime(date) {
            var dateToFormat = new Date(date)
            return dateToFormat.getHours() + ":" + dateToFormat.getMinutes().toString().padStart(2,0);
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
                               <th scope="col">Name</th>
                               <th scope="col">Day</th>
                               <th scope="col">Arrival</th>
                               <th scope="col">Departure</th>
                               <th scope="col">Meal</th>
                               <th scope="col">&nbsp;</th>
                         </tr>
                     </thead>
                     <tbody>
                     {this.state.presences.map((presence) => (
                         <tr>
                             <td>{this.state.peoples.filter((people) => (people.id == presence.personId)).map((people) => people.fullname)}</td>
                             <td>{presence.presenceDay ? (new Date(presence.presenceDay).toLocaleDateString()) : ("-")}</td>
                             <td>{presence.arrival ? (this.displayFormatedTime(presence.arrival)) : ("-")}</td>
                             <td>{presence.departure ? (this.displayFormatedTime(presence.departure)) : ("-")}</td>
                             <td>{presence.hasMeal ? ("With Meal") : ("Without Meal")}</td>

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