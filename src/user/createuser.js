import React, { Component } from 'react'
import axios from 'axios';
import {constants} from '../common';

class CreateUser extends Component {

    constructor(props) {
          super(props);
          this.onChangeName = this.onChangeName.bind(this);
          this.onChangeEmail = this.onChangeEmail.bind(this);
          this.onChangePassword = this.onChangePassword.bind(this);
          this.onSubmit = this.onSubmit.bind(this);

          this.state = {
              user_name: '',
              user_email: '',
              user_password:''
          }
      }
      onChangeName(e) {
        this.setState({
          user_name: e.target.value
        });
      }
      onChangeEmail(e) {
        this.setState({
          user_email: e.target.value
        })
      }
      onChangePassword(e) {
        this.setState({
          user_password: e.target.value
        })
      }

      onSubmit(e) {
        e.preventDefault();
        console.log(`The values are ${this.state.user_name}, ${this.state.user_email}, and ${this.state.user_password}`)

        const obj = {
              fullname: this.state.user_name,
              email: this.state.user_email,
              password: this.state.user_password
            };
            axios.put(constants.apiUrl + '/signup', obj)
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
                    <h3>Add New User</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Name:  </label>
                            <input type="text"
                                    className="form-control"
                                    value={this.state.user_name}
                                    onChange={this.onChangeName}/>
                        </div>
                        <div className="form-group">
                            <label>Email: </label>
                            <input type="text"
                                    className="form-control"
                                    value={this.state.user_email}
                                    onChange={this.onChangeEmail}/>
                        </div>
                        <div className="form-group">
                            <label>Password: </label>
                            <input type="text"
                                    className="form-control"
                                    value={this.state.user_password}
                                    onChange={this.onChangePassword}/>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Save" className="btn btn-primary"/>
                        </div>
                    </form>
                </div>
            )
        }
     };


    export default CreateUser