import React, { Component } from 'react';

import styles from './Styles.css';

import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import { connect } from 'react-redux';
import { setUserData, removeUserData } from '../Store/Actions/User/index';


import Toolbar from '../Toolbar/Toolbar'; 

/* Form Editor */
import FormEditor from '../Components/FormEditor/FormEditor';

/* User */
import Login from '../Components/Login/Login';
import UserForm from '../Components/Forms/UserForm';
import UserList from '../Components/Lists/UserList';

/* Records */
import FillableForm from '../Components/FillableForm/FillableForm';

/* Evaluation Plan */
import EvaluationPlanForm from '../Components/Forms/EvaluationPlanForm';
import EvaluationPlanList from '../Components/Lists/EvaluationPlanList';

/* Color Scales */
import ColorScaleForm from '../Components/Forms/ColorScaleForm';
import ColorScaleList from '../Components/Lists/ColorScaleList';


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

		this.state = {
			signedIn: props.token !== null,
			toolbarOpen: true
		};

		this.onSignIn = this.onSignIn.bind(this);
		this.onSignOut = this.onSignOut.bind(this);
		this.closeToolbar = this.closeToolbar.bind(this);
	}

	onSignIn = ( userData ) => {

		this.props.onSetUserData( userData.token, userData.name, userData.email, userData.type );

		this.setState({ signedIn: true });

	}

	onSignOut = () => {

		this.props.onRemoveUserData();

		this.setState({ signedIn: false });

	}

	openToolbar = () => {
		this.setState({ toolbarOpen: true });
	}

	closeToolbar = () => {
		this.setState({ toolbarOpen: false });
	}


	render(){

		return ( this.state.signedIn )?
					(
						<Router>
							<div className={ styles.LayoutContainer } >

								<div className={ styles.SuperiorBar }>
									<div className={ styles.ToolbarButton } onClick={ this.openToolbar }>
										<img src={ require('../img/menu.png') } alt="menu icon"/>
									</div>
								</div>

								<div className={ ( this.state.toolbarOpen )? styles.Toolbar : styles.ToolbarHidden }>
									<Toolbar closeToolbar={ this.closeToolbar } onSignOut={ this.onSignOut } hidden={ !this.state.toolbarOpen } />
								</div>
								
								<div className={ ( this.state.toolbarOpen )? styles.MainContent : styles.MainContentNoToolbar }>
									<Switch>
										<Route path='/formEditor'>
											<FormEditor />
										</Route>
										<Route path='/fillableForm'>
											<FillableForm />
										</Route>

										<Route path='/userList'>
											<UserList />
										</Route>
										<Route path='/userForm:id?'>
											<UserForm />
										</Route>

										<Route path='/colorScaleList'>
											<ColorScaleList />
										</Route>
										<Route path='/colorScaleForm:id?'>
											<ColorScaleForm />
										</Route>

										<Route path='/evaluationPlanList'>
											<EvaluationPlanList />
										</Route>
										<Route path='/evaluationPlanForm:id?'>
											<EvaluationPlanForm />
										</Route>

									</Switch>
								</div>

								<div className={ styles.Footer }>
								</div>

							</div>
						</Router>
					):(
						<Router>
							<div className={ styles.LayoutContainer } >

								<div className={ styles.MainContentNoToolbar }>
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