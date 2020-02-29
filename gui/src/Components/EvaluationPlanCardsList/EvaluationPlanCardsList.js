import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { Redirect } from "react-router-dom";

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

import RecordsTable from '../RecordsTable/PlanRecordsTable';

import { getToken, getUrlParams, getPlansAndForms, getPlanRecords, dateToYearMonthDay, randomNumber } from '../../Functions/FormEditorFunctions';


class planCardsList extends Component {

	constructor (props) {

		super(props);

		this.state = {
			planViews: [],
			loading: true,
			redirect: '',
			planRecords: [],
		};
	
	}

	componentDidMount(){

		let formsPromise = new Promise( ( resolve, reject ) => { getPlansAndForms(resolve, reject); });
		formsPromise.then( ( res ) => {

			let recordsPromises = res.map( (plan) => {

				let recordPromises = new Promise( (resolve, reject) => { getPlanRecords(plan._id, resolve, reject)} );
				return recordPromises.then( (records) => {
					
					return { _id: plan._id, records: records };

				});

			});

			Promise.all(recordsPromises).then( arrayOfResponses => {

				this.setState({ planRecords: arrayOfResponses });
				this.setPlanViews( res );

			});

		});

	}

	setPlanViews = ( data ) => {

		const planViews = data.map( ( plan, index ) => {

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
								<h4>Ver registros</h4>
							</div>
						</div>
					</div>);
		});

		return formViews;
	}

	formSelected = ( planId, planFormItemId, formId ) => {

		this.setState({
			redirect: '/formRecords?planId=' + planId + '&planFormItemId=' + planFormItemId + '&formId=' + formId
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

		const recordsIndex = planRecords.findIndex( (e) => e._id + '' === planId + '');

		return ( planRecords[recordsIndex].records.length > 0 )? 
					(<RecordsTable key={ planId + randomNumber() } title={ 'Registros' } forms={ formsRecordsArray } records={ planRecords[recordsIndex].records }/>)
					:(<div className={ styles.FormsListContainer }><div className={ styles.NoRecordsMessage}>No hay registros para mostrar.</div></div>);

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
								<h1 className={ styles.Title }>Seleccione un formulario</h1>
							</div>
							<div className={ styles.Content }>
								<div className={ styles.ListTitle }>
									<h2>Planes de Evaluación</h2>
								</div>
								<div className={ styles.PlansList }>
									{ this.state.planViews }
								</div>
							</div>
						</div>
					);

	}

}

export default planCardsList;