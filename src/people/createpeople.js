import React, { Component } from 'react'
import axios from 'axios';
import {constants} from '../common';

class CreatePeople extends Component {


    constructor(props) {
          super(props);
          this.onChangeName = this.onChangeName.bind(this);
          this.onButtonArrivalChange = this.onButtonArrivalChange.bind(this);
          this.onButtonDepartureChange = this.onButtonDepartureChange.bind(this);
          this.onButtonMealChange = this.onButtonMealChange.bind(this);
          this.onSubmit = this.onSubmit.bind(this);

          this.state = {
              fullname : '',
              standardArrival: new Map(),
              standardDeparture: new Map(),
              standardMeal: new Map()
          }
      }


      onChangeName(e) {
        this.setState({
          fullname : e.target.value
        });
      }

      /** Méthode permettznt de gérer les changements du niveau des boutons - A mutualiser */
      onButtonArrivalChange(e) {
            const item = e.target.value;
            e.target.classList.toggle('active');
            const active = e.target.classList.contains('active');
            this.state.standardArrival.set(item, active);
      }
      onButtonDepartureChange(e) {
            const item = e.target.value;
            e.target.classList.toggle('active');
            const active = e.target.classList.contains('active');
            this.state.standardDeparture.set(item, active);
      }
      onButtonMealChange(e) {
            const item = e.target.value;
            e.target.classList.toggle('active');
            const active = e.target.classList.contains('active');
            this.state.standardMeal.set(item, active);
      }

      /** Méthode permettant de filtrer la Map et de ne conserver que les éléments qui nous intéressent */
      filterMapElement(value, key, map) {
        if (value != true) {
            map.delete(key);
        }
      }

      onSubmit(e) {
              e.preventDefault();
              console.log(`The values are ${this.state.fullname}, ${Array.from( this.state.standardArrival.keys())}`)

              this.state.standardArrival.forEach(this.filterMapElement);
              this.state.standardDeparture.forEach(this.filterMapElement);
              this.state.standardMeal.forEach(this.filterMapElement);

              console.log(`The values are ${this.state.fullname}, ${Array.from( this.state.standardArrival.keys())}`)

              const obj = {
                    fullname: this.state.fullname,
                    standardArrival: Array.from( this.state.standardArrival.keys()),
                    standardDeparture:  Array.from( this.state.standardDeparture.keys()),
                    standardMeal: Array.from( this.state.standardMeal.keys())
                  };
                  axios.put(constants.apiUrl + '/people/', obj)
                      .then(res => console.log(res.data), this.props.history.push(`/people/list`))
                      .catch(error => {console.log(error);});

              this.setState({
                    fullname: '',
                    standardArrival: new Map(),
                    standardDeparture: new Map(),
                    standardMeal: new Map()
              })
      }


        render() {
            return (
                <div style={{marginTop: 10}}>
                    <h3>Create People</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Name:  </label>
                            <input type="text"
                                className="form-control"
                                value={this.state.user_name}
                                onChange={this.onChangeName} />
                        </div>
                        <div className="form-group">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-light disabled">Morning</button>
                                <button type="button" class="btn btn-secondary" value="MONDAY"  onClick={this.onButtonArrivalChange} >Monday</button>
                                <button type="button" class="btn btn-secondary" value="TUESDAY"  onClick={this.onButtonArrivalChange} >Tuesday</button>
                                <button type="button" class="btn btn-secondary" value="THURSDAY"  onClick={this.onButtonArrivalChange} >Thursday</button>
                                <button type="button" class="btn btn-secondary" value="FRIDAY"  onClick={this.onButtonArrivalChange} >Friday</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-light disabled">Evening</button>
                                <button type="button" class="btn btn-secondary" value="MONDAY"  onClick={this.onButtonDepartureChange} >Monday</button>
                                <button type="button" class="btn btn-secondary" value="TUESDAY"  onClick={this.onButtonDepartureChange} >Tuesday</button>
                                <button type="button" class="btn btn-secondary" value="THURSDAY"  onClick={this.onButtonDepartureChange} >Thursday</button>
                                <button type="button" class="btn btn-secondary" value="FRIDAY"  onClick={this.onButtonDepartureChange} >Friday</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-light disabled">Meal</button>
                                <button type="button" class="btn btn-secondary" value="MONDAY"  onClick={this.onButtonMealChange} >Monday</button>
                                <button type="button" class="btn btn-secondary" value="TUESDAY"  onClick={this.onButtonMealChange} >Tuesday</button>
                                <button type="button" class="btn btn-secondary" value="THURSDAY"  onClick={this.onButtonMealChange} >Thursday</button>
                                <button type="button" class="btn btn-secondary" value="FRIDAY"  onClick={this.onButtonMealChange} >Friday</button>
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


    export default CreatePeople