import React, { Component } from 'react'
import axios from 'axios'
import {constants} from '../common';

class UpdateUser extends Component {

        constructor(props) {
                  super(props);
                  this.onSubmit = this.onSubmit.bind(this);

                  this.state = {
                      user_id : '',
                      user_name: '',
                      user_email: '',
                      user_password:''
                  }
              }

              componentDidMount() {
                          fetch(constants.apiUrl + '/user/' + this.props.match.params.id)
                          .then(res => res.json())
                          .then((data) => {
                              this.setState({
                                user_id: data.id,
                                user_name: data.fullname,
                                user_email: data.email
                              })
                          })
                          .catch(console.log)
              }

              onChangeValue = param => e => {
                this.setState({
                  [param]: e.target.value
                })
              };

              onSubmit(e) {
                e.preventDefault();
                console.log(`The values are ${this.state.user_name}, ${this.state.user_email}, and ${this.state.user_password}`)

                const obj = {
                      id: this.state.user_id,
                      fullname: this.state.user_name,
                      email: this.state.user_email,
                      password: this.state.user_password
                    };
                    axios.post(constants.apiUrl + '/signup', obj)
                        .then(res => console.log(res.data), this.props.history.push(`/user/list`))
                        .catch(error => {console.log(error);});

                this.setState({
                  user_name: '',
                  user_email: '',
                  user_password: ''
                })
              }

                render() {
                    return (
                        <div style={{marginTop: 10}}>
                            <h3>Update User</h3>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Name:  </label>
                                    <input type="text"
                                            className="form-control"
                                            value={this.state.user_name}
                                            onChange={this.onChangeValue("user_name")}/>
                                </div>
                                <div className="form-group">
                                    <label>Email: </label>
                                    <input type="text"
                                            className="form-control"
                                            value={this.state.user_email}
                                            onChange={this.onChangeValue("user_email")}/>
                                </div>
                                <div className="form-group">
                                    <label>Password: </label>
                                    <input type="text"
                                            className="form-control"
                                            value={this.state.user_password}
                                            onChange={this.onChangeValue("user_password")}/>
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Save" className="btn btn-primary"/>
                                </div>
                            </form>
                        </div>
                    )
                }
             };


    export default UpdateUser