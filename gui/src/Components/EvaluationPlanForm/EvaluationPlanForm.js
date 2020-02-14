import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

import FormItem from '../EvaluationPlanFormItem/FormItem';

import { getUserTypes, getForms, moveElementInArray } from '../../Functions/FormEditorFunctions';

const EmptyFormItem = {
							form: '',
							weight: 0,
							requiredAmount: 0
						};

class evaluationPlanForm extends Component {

	constructor (props) {

		super(props);

		this.state = {
			name: '',
			userType: '',
			forms: [],
			startDate: '',
			endDate: '',

			formsData: [],
			userTypes: [],

			formViews: []
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


		let forms = this.state.forms;

		forms.forEach( ( e ) => {
			this.addForm( e );
		});
	}

	onChangeHandler = (field, e) => {
		this.setState({ [field]: e.target.value });
	}

	formFieldChangeHandler = ( key, field, value ) => {

		let forms = this.state.forms;

		const index = forms.findIndex( (e) => e.key === key );

		forms[ index ] = { ...forms[ index ], [field]: value };

		this.setState({ forms: forms });

	}

	addForm = ( data = null ) => {

		const key = data._id || 'f' + Math.round(Math.random() * 1000);

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

		this.setState({ 
						formViews: moveElementInArray( this.state.formViews, key, action ),
						forms: moveElementInArray( this.state.forms, key, action )
					});

	}

	deleteForm = ( key ) => {

		let formViews = this.state.formViews;
		let forms = this.state.forms;

		const index = formViews.findIndex( (e) => e.key === key );

		formViews.splice(index, 1);
		forms.splice(index, 1);

		this.setState({ formViews: formViews, forms: forms });

	}

	onSubmitHandler = () => {

		const data = {
			name: this.state.name,
			userType: this.state.userType,
			forms: this.state.forms,
			startDate: this.state.startDate,
			endDate: this.state.endDate
		};

		const params = {
			method: 'post',
			url: 'evaluationPlan/create',
			data: data,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
			}
		};
		
		axios(params)
		.then( (res) => {
			alert('Plan de evaluación creado.');
		})
		.catch( (res) => {
			console.log(res);
		});
		
	}

	render() {

		return (
			<div className={ styles.EvaluationPlanFormContainer }>
				<div className={ styles.Form }>
					<h2 className={ styles.Title }>Crear Plan de Evaluación</h2>
					<Input type='text' label='Nombre' name='name' value={ this.state.name } onChange={ this.onChangeHandler } />
					<Input type='select' label='Tipo de usuario a evaluar' name='userType' 
							value={ this.state.userType } 
							options={ this.state.userTypes } onChange={ this.onChangeHandler } />
					<Input type='date' label='Fecha de inicio' name='startDate' value={ this.state.startDate } onChange={ this.onChangeHandler } />
					<Input type='date' label='Fecha de fin' name='endDate' value={ this.state.endDate } onChange={ this.onChangeHandler } />
					
					<div className={ styles.FormsList }>
						Formularios
						<div>
							{ this.state.formViews }
						</div>
						<div className={ styles.AddFormButton } onClick={ this.addForm }>
							<h4 className={ styles.HorizontalAlign}>Agregar Formulario +</h4>
						</div>
					</div>

					<br/>
					<div className={ styles.ButtonContainer }>
						<SubmitButton text='Crear' type='primary' onClick={ this.onSubmitHandler } />
					</div>
				</div>
			</div>
		);
	}

}

export default evaluationPlanForm;
