import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {constants} from '../common';


    class Users extends Component {

        constructor(props) {
          super(props);
          this.state = { users: [] };
        }

        componentDidMount() {
            fetch(constants.apiUrl + '/user/')
            .then(res => res.json())
            .then((data) => {
                this.setState({ users: data })
            })
            .catch(console.log)
        }

        componentDidUpdate() {
            fetch(constants.apiUrl + '/user/')
            .then(res => res.json())
            .then((data) => {
                this.setState({ users: data })
            })
            .catch(console.log)
        }

        render() {
            return (
                <div>
                    <center><h1>Users List</h1></center>

                    <div>
                        <Link to={'/user/create'} className="nav-link">Create User</Link>
                    </div>

                    <table class="table">
                    <thead>
                        <tr>
                              <th scope="col">e-mail</th>
                              <th scope="col">name</th>
                              <th scope="col">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map((user) => (
                        <tr>
                            <td>{user.email}</td>
                            <td>{user.fullname}</td>
                            <td><Link to={'/user/update/' + user.id} className="nav-link">Update User</Link></td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
            )
        }
    };


    export default Users

