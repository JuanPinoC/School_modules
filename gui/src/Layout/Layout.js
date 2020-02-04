import React, { Component } from 'react';

import styles from './Styles.css';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import { connect } from 'react-redux';
import { setUserData, removeUserData } from '../Store/Actions/User/index';


/* Form Editor */
import FormEditor from '../Components/FormEditor/FormEditor';

/* User */
import Login from '../Components/Login/Login';
import UserForm from '../Components/UserForm/UserForm';


class Layout extends Component {
/*
	const formEditorData = {
		name: 'Formulario 1',
		type: 'Soft Abilities',
		action: 'avg',
		description: '',
		weight: 100,
		sections: [
			{
				name: 'Seccion 1',
				action: 'sum',
				weight: 40,
				inputs: [
					{
						label:	'Pregunta Númerica',
						type:	'Number',
						weight: 100,
						options: [],
						maxValue: 20,
						minValue: 0
					},
					{
						label:	'Pregunta Textual',
						type:	'Text',
						weight: 0,
						options: [],
						maxValue: 250,
						minValue: 50
					}
				]
			},
			{
				name: 'Seccion 2',
				action: 'avg',
				weight: 60,
				inputs: [
					{
						label:	'Pregunta de Opción Múltiple Númerica',
						type:	'Number Options',
						weight: 100,
						options: [ 
							{
								label: "Siempre", 
								numberValue: 20,
								stringValue: ''
							},
							{
								label: "Casi siempre",
								numberValue: 15,
								stringValue: '' 
							},
							{
								label: "Normalmente",
								numberValue: 10,
								stringValue: '' 
							},
							{
								label: "A veces",
								numberValue: 5,
								stringValue: ''
							},
							{
								label: "Nunca",
								numberValue: 0,
								stringValue: '' 
							}
						],
						maxValue: null,
						minValue: null
					},
					{
						label:	'Pregunta de Opción Múltiple Textual',
						type:	'Text Options',
						weight: 0,
						options: [ 
							{
								label: "Sí",
								numberValue: 0,
								stringValue: "Sí"
							},
							{
								label: "No",
								numberValue: 0,
								stringValue: "No"
							}
						],
						maxValue: null,
						minValue: null
					}
				]
			}
		],
	};
*/

	constructor (props) {
		super(props);

		this.onSignIn = this.onSignIn.bind(this);
		this.onSignOut = this.onSignOut.bind(this);
	}

	onSignIn = ( userData ) => {
		this.props.onSetUserData( userData.token, userData.name, userData.email, userData.type );
	}

	onSignOut = () => {
		this.props.onRemoveUserData();
	}

	render(){

		return ( this.props.token !== '' )?
					(
						<Router>
							<div className={ styles.LayoutContainer } >

								<div className={ styles.Toolbar }>
									<nav>
										<ul>
											<li>
												<Link to="/formEditor">Editor de Formularios</Link>
											</li>
											<li>
												<Link to="/userForm">Formulario de Usuarios</Link>
											</li>
											<li>
												<div onClick={ this.onSignOut }>Salir</div>
											</li>
										</ul>
									</nav>
								</div>
								
								<div className={ styles.MainContent }>
									<Switch>
										<Route path="/formEditor">
											<FormEditor />
										</Route>
										<Route path="/userForm">
											<UserForm />
										</Route>
									</Switch>
								</div>

								<div className={ styles.Footer }>
								</div>

							</div>
						</Router>
					):(
						<Router>
							<div className={ styles.AppContainer } >

								<div className={ styles.MainContent }>
									<Switch>
										<Route path="/">
											<Login onSignIn={ this.onSignIn } />
										</Route>
									</Switch>
								</div>

								<div className={ styles.Footer }>
								</div>

							</div>
						</Router>
					);
	}
	
}

const mapStateToProps = state => {
	return {
		token: state.user.token
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSetUserData: ( token, name, email, type ) => { dispatch( setUserData( token, name, email, type ) ) },
		onRemoveUserData: () => { dispatch( removeUserData() )}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);