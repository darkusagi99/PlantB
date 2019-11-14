import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import firebase from '../firebase';

class People extends Component {

    // Constructeur
    constructor(props) {

        super(props);

        this.affichageJours = this.affichageJours.bind(this);

        this.ref = firebase.firestore().collection('peoples');
        this.state = { peoples: [] };
    }

    // Chargement lors du montage
    componentDidMount() {

        var newPeople = [];
        var that = this;

        this.ref.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                var currentData = doc.data();
                currentData.id = doc.id;

                newPeople.push(currentData);

                that.setState({
                    peoples: newPeople
                });

                console.log(doc.id, " => ", doc.data());
            });
        });

    }

    // Méthode mise en forme affichage
    affichageJours(listJours) {

        var list = ["MONDAY","TUESDAY","THURSDAY","FRIDAY"];

        var listeRetour = '';

        listJours.sort(function(a,b) { return list.indexOf(a) > list.indexOf(b); })
        .forEach(
            function(element) {
                var elementTxt = element;

                switch (element) {
                    case 'MONDAY':
                        elementTxt = 'Lundi';
                        break;
                    case 'TUESDAY':
                        elementTxt = 'Mardi';
                        break;
                    case 'THURSDAY':
                        elementTxt = 'Jeudi';
                        break;
                    case 'FRIDAY':
                        elementTxt = 'Vendredi';
                        break;
                    default:
                        break;
                }

                listeRetour = listeRetour + ' ' + elementTxt;
            }
        );

        return listeRetour;
    }

    // Méthode de rendu de la page
    render() {
        return (
            <div>
                <center><h1>Elèves</h1></center>

                <div>
                    <Link to={'/people/create'} className="nav-link">Ajouter élève</Link>
                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Matin</th>
                            <th scope="col">Soir</th>
                            <th scope="col">Repas</th>
                            <th scope="col">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.peoples.map((people) => (
                            <tr key={people.id}>
                                <td>{people.fullname}</td>
                                <td>{this.affichageJours(people.standardArrival)}</td>
                                <td>{this.affichageJours(people.standardDeparture)}</td>
                                <td>{this.affichageJours(people.standardMeal)}</td>
                                <td><Link to={'/people/update/' + people.id} className="nav-link">MàJ élève</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        )
    }


     };


export default People