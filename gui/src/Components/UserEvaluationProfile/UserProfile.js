import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { Redirect } from "react-router-dom";

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

import RecordsTable from '../RecordsTable/PlanRecordsTable';

import { getToken, getUrlParams, getUser, getUserPlanForms, getPlanRecordsByUser, dateToYearMonthDay, randomNumber } from '../../Functions/FormEditorFunctions';


class userProfile extends Component {

	constructor (props) {

		super(props);

		this.state = {

			planRecords: [],

			id: '',
			name: '',
			type: '',
			email: '',
			planViews: [],
			loading: true,
			redirect: ''
		};
	
	}

	componentDidMount(){

		const params = getUrlParams();

		if( params.id !== null && typeof params.id !== 'undefined' ){

			let userPromise = new Promise( ( resolve, reject ) => { getUser( params.id, resolve, reject); });
			userPromise.then( ( res ) => {
				
				this.setState({
					id: params.id,
					name: res.name,
					type: res.type.name,
					email: res.email
				});

				let formsPromise = new Promise( ( resolve, reject ) => { getUserPlanForms( res.type._id, resolve, reject); });
				formsPromise.then( ( formsRes ) => {

					let PlanRecordsPromise = new Promise( ( resolve, reject ) => { getPlanRecordsByUser( res.type._id, params.id, resolve, reject); });

					PlanRecordsPromise.then( ( planRecords ) => {

						this.setState({ planRecords: planRecords });
						this.setPlanViews( formsRes );

					});

				});

			});

		}

	}

	setPlanViews = ( data ) => {

		const planViews = data.map( ( plan ) => {

			const formViews = this.getFormViews( plan._id, plan.forms );

			return (<div className={ styles.PlanListItem } key={ plan._id } _id={ plan._id }>
						<div className={ styles.PlanInfo }>
							<h3 className={ styles.SectionTitle }>{ plan.name }</h3>
							<h3 className={ styles.PlanPeriod }>
								{ 'Periodo: ' + dateToYearMonthDay(plan.startDate).replace(/-/g, '/') + ' - ' + dateToYearMonthDay(plan.endDate).replace(/-/g, '/')}
							</h3>
						</div>

						{ this.getRecords( plan._id, plan.forms ) }

						<div className={ styles.FormsListContainer }>
							<div className={ styles.ListTitle }>
								<h3>Formularios</h3>
							</div>
							<div className={ styles.FormsList }>
								{ formViews }
							</div>
						</div>
					</div>);

		});

		this.setState({
			planViews: planViews,
			loading: false
		});

	}

	getRecords = ( planId, data ) => {

		const formsRecordsArray = data.map( (form) => {

			return {
				_id: form.form,
				name: form.name,
				weight: form.weight + '%',
				colorScale: form.colorScale
			}
		});

		const planRecords = this.state.planRecords;

		const recordsIndex = planRecords.findIndex( (e) => e.planId + '' === planId + '');

		return ( typeof planRecords[recordsIndex].records.formAvgs !== 'undefined' )? 
					(<RecordsTable key={ planId + randomNumber() } title={ 'Registros' } forms={ formsRecordsArray } records={ [planRecords[recordsIndex].records] }/>)
					:(<div className={ styles.FormsListContainer }><div className={ styles.NoRecordsMessage}>No hay registros para mostrar.</div></div>);

	}

	getFormViews = ( planId, data ) => {

		const formViews = data.map( ( form ) => {
			return(<div className={ styles.FormListItem } key={ form._id }>
						<div className={ styles.FormInfo }>
							<div className={ styles.FormTitle}>
								<h4>{ form.name }</h4>
							</div>
							<div className={ styles.InfoItem}>
								<label>Tipo:</label>
								<h5>{ form.type }</h5>
							</div>
							<div className={ styles.InfoItem}>
								<label>Peso(%):</label>
								<h5>{ form.weight }</h5>
							</div>
							<div className={ styles.InfoItem}>
								<label>Cant. Requerida:</label>
								<h5>{ form.requiredAmount }</h5>
							</div>
							<div className={ styles.FormSelectButton } 
									onClick={ () => { this.formSelected( planId, form._id, form.form ) } }>
								<h4>Llenar evaluación</h4>
							</div>
						</div>
					</div>);
		});

		return formViews;
	}

	formSelected = ( planId, planFormItemId, formId ) => {

		this.setState({
			redirect: '/fillableForm?planId=' + planId + '&planFormItemId=' + planFormItemId + 
						'&formId=' + formId + '&userId=' + this.state.id + '&userName=' + this.state.name
		});

	}


	render() {

		if( this.state.redirect !== '' )
			return ( <Redirect to={this.state.redirect} /> );

		return ( this.state.loading )?
					(
						<div className={ styles.ProfileContainer }>
							<h1>Loading</h1>
						</div>
					):(
						<div className={ styles.ProfileContainer }>
							<div className={ styles.TitleContainer }>
								<h1 className={ styles.Title }>Perfil de Usuario</h1>
							</div>
							<div className={ styles.Content }>
								<div className={ styles.UserInfo }>
									<div className={ styles.UserInfoItem }>
										<div className={ styles.InfoItem}>
											<label>Nombre:</label>
											<h3>{ this.state.name }</h3>
										</div>
										<div className={ styles.InfoItem}>
											<label>Tipo de Usuario:</label>
											<h3>{ this.state.type }</h3>
										</div>
										<div className={ styles.InfoItem}>
											<label>E-mail:</label>
											<h3>{ this.state.email }</h3>
										</div>
									</div>
									<div className={ styles.UserInfoItem }>

									</div>
								</div>
								<div className={ styles.ListTitle }>
									<h2>Planes de Evaluación</h2>
								</div>
								<div className={ styles.PlansList }>
									{
										( this.state.planViews.length > 0 )? 
											this.state.planViews : 
											(
												<div className={ styles.FormsListContainer }>
													<div className={ styles.NoRecordsMessage}>
														No hay planes para mostrar.
													</div>
												</div>
											)
									}
								</div>
							</div>
						</div>
					);

	}

}

export default userProfile;
