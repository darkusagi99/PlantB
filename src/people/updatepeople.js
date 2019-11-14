import React, { Component } from 'react'
import firebase from '../firebase';

class UpdatePeople extends Component {

    // Constructeur
    constructor(props) {
        super(props);

        // Bind méthodes
        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        // déclaration firebase
        this.ref = firebase.firestore().collection('peoples');

        // déclaration state
        this.state = {
            id : '',
            fullname : '',
            standardArrival: new Map(),
            standardDeparture: new Map(),
            standardMeal: new Map()
        }
    }

    // Chargement montage composant
    componentDidMount() {

        // Uniquement pour la mise à jour
        if (this.props.match.params.id !== undefined) {

            // Chargement données et mise à jour page
            this.ref.doc(this.props.match.params.id)
            .get()
            .then((doc) => {
                this.setState({
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
    }

    // Gestion changements nom
    onChangeName(e) {
        this.setState({
            fullname : e.target.value
        });
    }

    /** Méthode permettant de gérer les changements du niveau des boutons */
    onChangeButtonValue = (param, that) => e => {

        const item = e.target.value;
        e.target.classList.toggle('active');
        const active = e.target.classList.contains('active');
        var currentState;

        switch(param) {
            case "standardArrival" :
                currentState = that.state.standardArrival;
                break;
            case "standardDeparture" :
                currentState = that.state.standardDeparture;
                break;
            case "standardMeal" :
                currentState = that.state.standardMeal;
                break;
            default :
                console.error("Pas de valeurs");
        }

        this.setState({
            [param]: currentState.set(item, active)
        })
    };

    /** Méthode permettant de filtrer la Map et de ne conserver que les éléments qui nous intéressent */
    filterMapElement(value, key, map) {
        if (value !== true) {
            map.delete(key);
        }
    }

    // Méthode sauvegarde
    onSubmit(e) {
        e.preventDefault();

        // Nettoyage des listes à sauver
        this.state.standardArrival.forEach(this.filterMapElement);
        this.state.standardDeparture.forEach(this.filterMapElement);
        this.state.standardMeal.forEach(this.filterMapElement);

        // Construction objet de sauvegarde
        const obj = {
            fullname: this.state.fullname,
            standardArrival: Array.from( this.state.standardArrival.keys()),
            standardDeparture:  Array.from( this.state.standardDeparture.keys()),
            standardMeal: Array.from( this.state.standardMeal.keys())
        };

        // Test Create / update et sauvegarde
        if (this.props.match.params.id === undefined) {
            this.ref.add({
                fullname: this.state.fullname,
                standardArrival: Array.from( this.state.standardArrival.keys()),
                standardDeparture:  Array.from( this.state.standardDeparture.keys()),
                standardMeal: Array.from( this.state.standardMeal.keys())
            })
            .then((docRef) => {
                this.props.history.push("/people/list")
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        } else {

            this.ref.doc(this.props.match.params.id).set(obj)
            .then(this.props.history.push(`/people/list`))
            .catch(error => {console.log(error);});
        }
    }

    // Rendu de la page
    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>{this.props.match.params.id === undefined ? "Création élève" : "MàJ élève" }</h3>
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
                            <button type="button" className="btn btn-light disabled">Matin</button>
                            <button type="button" className="btn btn-secondary" value="MONDAY" ref="arrivalMonday"  onClick={this.onChangeButtonValue("standardArrival", this)} >Lundi</button>
                            <button type="button" className="btn btn-secondary" value="TUESDAY" ref="arrivalTuesday"  onClick={this.onChangeButtonValue("standardArrival", this)} >Mardi</button>
                            <button type="button" className="btn btn-secondary" value="THURSDAY" ref="arrivalThursday"  onClick={this.onChangeButtonValue("standardArrival", this)} >Jeudi</button>
                            <button type="button" className="btn btn-secondary" value="FRIDAY" ref="arrivalFriday"  onClick={this.onChangeButtonValue("standardArrival", this)} >Vendredi</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-light disabled">Soir</button>
                            <button type="button" className="btn btn-secondary" value="MONDAY" ref="leaveMonday"  onClick={this.onChangeButtonValue("standardDeparture", this)} >Lundi</button>
                            <button type="button" className="btn btn-secondary" value="TUESDAY" ref="leaveTuesday"  onClick={this.onChangeButtonValue("standardDeparture", this)} >Mardi</button>
                            <button type="button" className="btn btn-secondary" value="THURSDAY" ref="leaveThursday"  onClick={this.onChangeButtonValue("standardDeparture", this)} >Jeudi</button>
                            <button type="button" className="btn btn-secondary" value="FRIDAY" ref="leaveFriday"  onClick={this.onChangeButtonValue("standardDeparture", this)} >Vendredi</button>

                        </div>
                    </div>
                    <div className="form-group">
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-light disabled">Repas</button>
                            <button type="button" className="btn btn-secondary" value="MONDAY" ref="mealMonday"  onClick={this.onChangeButtonValue("standardMeal", this)} >Lundi</button>
                            <button type="button" className="btn btn-secondary" value="TUESDAY" ref="mealTuesday"  onClick={this.onChangeButtonValue("standardMeal", this)} >Mardi</button>
                            <button type="button" className="btn btn-secondary" value="THURSDAY" ref="mealThursday"  onClick={this.onChangeButtonValue("standardMeal", this)} >Jeudi</button>
                            <button type="button" className="btn btn-secondary" value="FRIDAY" ref="mealFriday"  onClick={this.onChangeButtonValue("standardMeal", this)} >Vendredi</button>
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