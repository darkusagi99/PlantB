import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PeopleContext from './peoplecontext';

class People extends Component {

    static contextType = PeopleContext;

    // Constructeur
    constructor(props) {

        super(props);

        this.affichageJours = this.affichageJours.bind(this);
        this.state = { peoples: [] };
    }

    // Chargement lors du montage
    componentDidMount() {

        this.setState({
            peoples : this.context
        });

    }

    componentDidUpdate() {
        // Chargement liste personnes
        if (this.context !== this.state.peoples) {
            this.setState({
                peoples : this.context
            });
        }
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