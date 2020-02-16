import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { Redirect } from "react-router-dom";

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

import FormItem from '../EvaluationPlanFormItem/FormItem';

import { getToken, getUrlParams, getEvaluationPlan, getUserTypes, getForms, dateToYearMonthDay, moveElementInArray, randomNumber } from '../../Functions/FormEditorFunctions';

const EmptyFormItem = {
							form: '',
							weight: 0,
							requiredAmount: 0
						};

class evaluationPlanForm extends Component {

	constructor (props) {

		super(props);

		this.state = {
			id: '',
			name: '',
			userType: '',
			forms: [],
			startDate: '',
			endDate: '',

			formsData: [],
			userTypes: [],

			formViews: [],

			disableSubmit: false,
			disableMoveForm: false,
			loading: true,
			redirect: ''
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);

		this.moveForm = this.moveForm.bind(this);
		this.deleteForm = this.deleteForm.bind(this);
		this.formFieldChangeHandler = this.formFieldChangeHandler.bind(this);

		this.onSubmitHandler = this.onSubmitHandler.bind(this);
	
	}

	componentDidMount(){

		let userTypesPromise = new Promise( ( resolve, reject ) => { getUserTypes(resolve, reject); });
		userTypesPromise.then( 
			( res ) => {
							this.setState({ userTypes: res, userType: ( this.state.userType === '' )? res[0]._id : this.state.userType });
			} );

		let formsPromise = new Promise( ( resolve, reject ) => { getForms(resolve, reject); });
		formsPromise.then( ( res ) => { this.setState({ formsData: res }); } );

		const params = getUrlParams();

		if( params.id !== null && typeof params.id !== 'undefined' ){

			let evaluationPlanPromise = new Promise( ( resolve, reject ) => { getEvaluationPlan( params.id, resolve, reject); });
			evaluationPlanPromise.then( ( res ) => {
				
				this.setState({
					id: params.id,
					name: res.name,
					userType: res.userType,
					forms: res.forms,
					startDate: dateToYearMonthDay( res.startDate ),
					endDate: dateToYearMonthDay( res.endDate ),
					loading: false
				});

				let forms = res.forms;

				forms.forEach( ( e ) => {
					this.addForm( e );
				});
				
			} );

		}else{
			this.setState({ loading: false });
		}

	}

	onChangeHandler = (field, e) => {
		this.setState({ [field]: e.target.value });
	}

	formFieldChangeHandler = ( key, field, value ) => {

		let forms = this.state.forms;

		const index = forms.findIndex( (e) => e.key === key || e._id === key || e.id === key );

		forms[ index ] = { ...forms[ index ], [field]: value };

		this.setState({ forms: forms });

	}

	addForm = ( data = null ) => {

		const key = data._id || 'f' + randomNumber();

		this.setState( (state, props) => ({
			formViews: [	...state.formViews,
							(<FormItem id={ key } key={ key } data={ data } formsData={ this.state.formsData }
								onFieldChangeHandler={ this.formFieldChangeHandler } 
								move={ (action) => { this.moveForm(action, key) } }
								delete={ () => { this.deleteForm( key ) } } />)	]
		}));

		if( typeof data._id === 'undefined' ){

			this.setState({ forms: [ ...this.state.forms, { ...EmptyFormItem, key: key } ]  });

		}

	}

	moveForm = ( action, key ) => {

		if( !this.state.disableMoveForm ){

			this.setState({ disableMoveForm: true });

			const forms = this.state.forms;
			const formViews = this.state.formViews;

			this.setState({ 
							forms: moveElementInArray( forms, key, action ),
							formViews: moveElementInArray( formViews, key, action ),
							disableMoveForm: false
						});

		}

	}

	deleteForm = ( key ) => {

		let formViews = this.state.formViews;
		let forms = this.state.forms;

		const index = formViews.findIndex( (e) => e.key === key || e._id === key || e.id === key );

		formViews.splice(index, 1);
		forms.splice(index, 1);

		this.setState({ formViews: formViews, forms: forms });

	}

	onSubmitHandler = () => {

		this.setState({ disableSubmit: true });

		const data = {
			id: this.state.id,
			name: this.state.name,
			userType: this.state.userType,
			forms: this.state.forms,
			startDate: this.state.startDate,
			endDate: this.state.endDate
		};

		const url = ( data.id === '' )? 'evaluationPlan/create' : 'evaluationPlan/update';

		const params = {
			method: 'post',
			url: url,
			data: data,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + getToken()
			}
		};
		
		axios(params)
		.then( (res) => {
			alert('Plan de evaluación guardado.');
			this.setState({ redirect: '/evaluationPlanList' });
		})
		.catch( (res) => {
			alert('Error al guardar. Intente de nuevo.');
			this.setState({ disableSubmit: false });
		});
		
	}

	render() {

		if( this.state.redirect !== '' )
			return ( <Redirect to={this.state.redirect} /> );

		return ( this.state.loading )?
					(
						<div className={ styles.FormContainer }>
							<h1>Loading</h1>
						</div>
					):(
						<div className={ styles.FormContainer }>
							<div className={ styles.TitleContainer }>
								<h1 className={ styles.Title }>{ ( this.state.id !== '' )? 'Editar' : 'Crear' } Plan de Evaluación</h1>
							</div>
							<div className={ styles.Form }>
								<div className={ styles.Grid5050 }>
									<Input type='text' label='Nombre' name='name' value={ this.state.name } 
											onChange={ this.onChangeHandler } />
									<Input type='select' label='Usuarios evaluados' name='userType' value={ this.state.userType } 
											options={ this.state.userTypes } onChange={ this.onChangeHandler } />
									<Input type='date' label='Fecha de inicio' name='startDate' value={ this.state.startDate } 
											onChange={ this.onChangeHandler } />
									<Input type='date' label='Fecha de fin' name='endDate' value={ this.state.endDate } 
											onChange={ this.onChangeHandler } />
								</div>

								<div className={ styles.FormsList }>
									<div className={ styles.SubtitleContainer }>
										<h3>Formularios</h3>
									</div>
									<div>
										{ this.state.formViews }
									</div>
									<div className={ styles.AddItemButton } onClick={ this.addForm }>
										<h4>Agregar Formulario +</h4>
									</div>
								</div>

								<br/>
								<div className={ styles.ButtonContainer }>
									<SubmitButton text={ ( this.state.id !== '' )?'Guardar Cambios':'Crear Plan' } type='primary' 
													onClick={ this.onSubmitHandler } disabled={ this.state.disableSubmit } />
								</div>
							</div>
						</div>
					);

	}

}

export default evaluationPlanForm;
