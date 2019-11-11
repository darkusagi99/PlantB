import React, { Component } from 'react'
import {constants} from '../common';
import firebase from '../firebase';

class UpdatePeople extends Component {

    constructor(props) {
          super(props);
          this.onChangeName = this.onChangeName.bind(this);
          this.onButtonArrivalChange = this.onButtonArrivalChange.bind(this);
          this.onButtonDepartureChange = this.onButtonDepartureChange.bind(this);
          this.onButtonMealChange = this.onButtonMealChange.bind(this);
          this.onSubmit = this.onSubmit.bind(this);

          this.ref = firebase.firestore().collection('peoples').doc(this.props.match.params.id);

          this.state = {
              id : '',
              fullname : '',
              standardArrival: new Map(),
              standardDeparture: new Map(),
              standardMeal: new Map(),
              previousPeople: ''
          }
      }


      componentDidMount() {
            this.ref.get()
            .then((doc) => {
                this.setState({
                    previousPeople: doc.data(),
                    id : doc.id,
                    fullname : doc.data().fullname,
                    standardArrival : new Map(doc.data().standardArrival.map(i => [i, true])),
                    standardDeparture : new Map(doc.data().standardDeparture.map(i => [i, true])),
                    standardMeal : new Map(doc.data().standardMeal.map(i => [i, true]))
                 });
                 doc.data().standardArrival.includes("MONDAY") ? this.refs.arrivalMonday.classList.add('active') : this.refs.arrivalMonday.classList.remove('active') ;
                 doc.data().standardArrival.includes("TUESDAY") ? this.refs.arrivalTuesday.classList.add('active') : this.refs.arrivalTuesday.classList.remove('active') ;
                 doc.data().standardArrival.includes("THURSDAY") ? this.refs.arrivalThursday.classList.add('active') : this.refs.arrivalThursday.classList.remove('active') ;
                 doc.data().standardArrival.includes("FRIDAY") ? this.refs.arrivalFriday.classList.add('active') : this.refs.arrivalFriday.classList.remove('active') ;
                 doc.data().standardDeparture.includes("MONDAY") ? this.refs.leaveMonday.classList.add('active') : this.refs.leaveMonday.classList.remove('active') ;
                 doc.data().standardDeparture.includes("TUESDAY") ? this.refs.leaveTuesday.classList.add('active') : this.refs.leaveTuesday.classList.remove('active') ;
                 doc.data().standardDeparture.includes("THURSDAY") ? this.refs.leaveThursday.classList.add('active') : this.refs.leaveThursday.classList.remove('active') ;
                 doc.data().standardDeparture.includes("FRIDAY") ? this.refs.leaveFriday.classList.add('active') : this.refs.leaveFriday.classList.remove('active') ;
                 doc.data().standardMeal.includes("MONDAY") ? this.refs.mealMonday.classList.add('active') : this.refs.mealMonday.classList.remove('active') ;
                 doc.data().standardMeal.includes("TUESDAY") ? this.refs.mealTuesday.classList.add('active') : this.refs.mealTuesday.classList.remove('active') ;
                 doc.data().standardMeal.includes("THURSDAY") ? this.refs.mealThursday.classList.add('active') : this.refs.mealThursday.classList.remove('active') ;
                 doc.data().standardMeal.includes("FRIDAY") ? this.refs.mealFriday.classList.add('active') : this.refs.mealFriday.classList.remove('active') ;
            })
            .catch(console.log)
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
                    id : this.state.id,
                    fullname: this.state.fullname,
                    standardArrival: Array.from( this.state.standardArrival.keys()),
                    standardDeparture:  Array.from( this.state.standardDeparture.keys()),
                    standardMeal: Array.from( this.state.standardMeal.keys())
                  };
                  this.ref.set(obj)
                      .then(this.props.history.push(`/people/list`))
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
                    <h3>Maj élève</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Nom:  </label>
                            <input type="text"
                                className="form-control"
                                value={this.state.fullname}
                                onChange={this.onChangeName} />
                        </div>
                        <div className="form-group">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-light disabled">Matin</button>
                                <button type="button" class="btn btn-secondary" value="MONDAY" ref="arrivalMonday"  onClick={this.onButtonArrivalChange} >Lundi</button>
                                <button type="button" class="btn btn-secondary" value="TUESDAY" ref="arrivalTuesday"  onClick={this.onButtonArrivalChange} >Mardi</button>
                                <button type="button" class="btn btn-secondary" value="THURSDAY" ref="arrivalThursday"  onClick={this.onButtonArrivalChange} >Jeudi</button>
                                <button type="button" class="btn btn-secondary" value="FRIDAY" ref="arrivalFriday"  onClick={this.onButtonArrivalChange} >Vendredi</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-light disabled">Soir</button>
                                <button type="button" class="btn btn-secondary" value="MONDAY" ref="leaveMonday"  onClick={this.onButtonDepartureChange} >Lundi</button>
                                <button type="button" class="btn btn-secondary" value="TUESDAY" ref="leaveTuesday"  onClick={this.onButtonDepartureChange} >Mardi</button>
                                <button type="button" class="btn btn-secondary" value="THURSDAY" ref="leaveThursday"  onClick={this.onButtonDepartureChange} >Jeudi</button>
                                <button type="button" class="btn btn-secondary" value="FRIDAY" ref="leaveFriday"  onClick={this.onButtonDepartureChange} >Vendredi</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-light disabled">Repas</button>
                                <button type="button" class="btn btn-secondary" value="MONDAY" ref="mealMonday"  onClick={this.onButtonMealChange} >Lundi</button>
                                <button type="button" class="btn btn-secondary" value="TUESDAY" ref="mealTuesday"  onClick={this.onButtonMealChange} >Mardi</button>
                                <button type="button" class="btn btn-secondary" value="THURSDAY" ref="mealThursday"  onClick={this.onButtonMealChange} >Jeudi</button>
                                <button type="button" class="btn btn-secondary" value="FRIDAY" ref="mealFriday"  onClick={this.onButtonMealChange} >Vendredi</button>
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


    export default UpdatePeople