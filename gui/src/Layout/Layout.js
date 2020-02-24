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
import UserEvaluationList from '../Components/Lists/UserEvaluationList';
import UserEvaluationProfile from '../Components/UserEvaluationProfile/UserProfile';

/* Records */
import FillableForm from '../Components/FillableForm/FillableForm';
import PerformedEvaluationsList from '../Components/Lists/PerformedEvaluationsList';
import PerformedEvaluationsAsEvaluatedList from '../Components/Lists/PerformedEvaluationsAsEvaluatedList';
import EvaluationPlanCardsList from '../Components/EvaluationPlanCardsList/EvaluationPlanCardsList';
import FormRecordsList from '../Components/Lists/FormRecordsList';

/* Evaluation Plan */
import EvaluationPlanList from '../Components/Lists/EvaluationPlanList';
import EvaluationPlanForm from '../Components/Forms/EvaluationPlanForm';

/* Color Scales */
import ColorScaleList from '../Components/Lists/ColorScaleList';
import ColorScaleForm from '../Components/Forms/ColorScaleForm';

/* Form */
import FormList from '../Components/Lists/FormList';


class Layout extends Component {

	constructor (props) {
		super(props);

		this.state = {
			signedIn: props.token !== null,
			toolbarOpen: false
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

										<Route path='/fillableForm:planId?:planFormItemId?:formId?:userId?:userName?'>
											<FillableForm />
										</Route>
										
										<Route path='/records'>
											<EvaluationPlanCardsList />
										</Route>
										<Route path='/formRecords'>
											<FormRecordsList />
										</Route>
										
										<Route path='/performedEvaluations'>
											<PerformedEvaluationsList />
										</Route>
										<Route path='/performedEvaluationsAsEvaluated'>
											<PerformedEvaluationsAsEvaluatedList />
										</Route>

										<Route path='/evaluationPlanList'>
											<EvaluationPlanList />
										</Route>
										<Route path='/evaluationPlanForm:id?'>
											<EvaluationPlanForm />
										</Route>
										<Route path='/colorScaleList'>
											<ColorScaleList />
										</Route>
										<Route path='/colorScaleForm:id?'>
											<ColorScaleForm />
										</Route>
										<Route path='/formList'>
											<FormList />
										</Route>
										<Route path='/formEditor:id?'>
											<FormEditor />
										</Route>

										<Route path='/userList'>
											<UserList />
										</Route>
										<Route path='/userForm:id?'>
											<UserForm />
										</Route>
										<Route path='/userEvaluationList'>
											<UserEvaluationList />
										</Route>
										<Route path='/userEvaluationProfile:id?'>
											<UserEvaluationProfile />
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