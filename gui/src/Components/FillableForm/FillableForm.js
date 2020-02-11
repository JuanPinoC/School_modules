import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { connect } from 'react-redux';

import { FormTypes, FormActions, getColorScales, getUsers, getForm, moveElementInArray } from '../../Functions/FormEditorFunctions';

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

const item = {
	input: '',
	answerString: '',
	answerNumber: 0
};

class FillableForm extends Component {

	constructor( props ){

		super(props);

		this.state = {
			formId: '5e3cdab9d6364d2f6cf4da17',
			evaluated: '',
			form: {},
			items: [],

			formTypes: FormTypes,
			users: [],
			colorScales: [],
			evaluatedUserFields: []
		};

	}

	componentDidMount () {

		let usersPromise = new Promise( ( resolve, reject ) => { getUsers(resolve, reject); });
		usersPromise.then( ( res ) => { this.setState({ users: res }); } );

		let colorScalesPromise = new Promise( ( resolve, reject ) => { getColorScales(resolve, reject); });
		colorScalesPromise.then( ( res ) => { this.setState({ colorScales: res }); } );

		let formPromise = new Promise( ( resolve, reject ) => { getForm( this.state.formId, resolve, reject); });
		formPromise.then( ( res ) => { 
			this.setState({ form: res });
			this.getSectionViews();
		} );
	}

	onChangeHandler = ( inputId, e ) => {

		if( inputId === 'evaluated' ){
			this.setState({ evaluated: e.target.value });
			return;
		}
		
		let items = this.state.items;
		
		const id = items.findIndex( (e) => e.input === inputId );

		if( id < 0 ) {
			items.push({
					input: inputId,
					answer: e.target.value
			});
		} else {
			items[id] = {
					input: inputId,
					answer:	e.target.value
			};
		}

		this.setState({ items: items });
	}

	getSectionViews = () => {

		const sections = this.state.form.sections || [];

		let sectionViews = sections.map( (section) => {
			return (
				<div className={ styles.Section } key={ section._id }>
					<h3 className={ styles.SectionName }>{ section.name }</h3>
					<h5 className={ styles.SectionWeight }>{ section.weight }</h5>
					<h5>{ section.order }</h5>
					<div className={ styles.InputsList }>
						{ this.getInputViews(section.inputs) }
					</div>
				</div>
			);
		});

		this.setState({ sectionViews: sectionViews });

	}

	getInputViews = ( inputs ) => {

		let inputViews = inputs.map( (input) => {

			if( input.evaluatedUserField ) this.setState({ evaluatedUserFields: [ ...this.state.evaluatedUserFields, input._id ] });

			const key = 'i' + Math.round(Math.random() * 1000);

			switch(input.type){
				case 'Number':
					return(
						<Input key={ key } label={ input.label } type='number' name={ input._id } value={ this.state.items[input._id] } 
								onChange={ this.onChangeHandler } 
								max={ input.maxValue }
								min={ input.minValue } />

					);
					break;

				case 'Text':
					return(
						<Input key={ key } label={ input.label } type='textarea' name={ input._id } value={ this.state.items[input._id] } 
								onChange={ this.onChangeHandler } 
								max={ input.maxValue }
								min={ input.minValue } />
					);
					break;

				case 'Number Options':

					return(
						<Input key={ key } label={ input.label } type='radiobuttons' name={ input._id } value={ this.state.items[input._id] } 
								onChange={ this.onChangeHandler } 
								options={ input.options } />
					);
					break;

				case 'Text Options':
					return(
							<Input key={ key } label={ input.label } type='radiobuttons' name={ input._id } value={ this.state.items[input._id] } 
									onChange={ this.onChangeHandler } 
									options={ input.options } />
					);
					break;

			}

		});

		return inputViews;
	}

	submitForm = () => {

		const data = {
			evaluatedUser: this.state.evaluated,
			form: this.state.formId,
			items: this.state.items
		};

		const params = {
			method: 'post',
			url: 'record/create',
			data: data,
			headers: {
				'Content-Type': 'application/json'
			}
		};
			
		axios(params)
		.then( (res) => {
			this.props.onSignIn( res.data );
		})
		.catch( (res) => {
			alert('Usuario o contraseña incorrectos.');
		});

	}

	render () {

		const form = { ...this.state.form, sections: [] };

		return (
			<div className={ styles.FillableFormContainer }>
				<div className={ styles.FormFields}>
					<h1 className={ styles.FormTitle }>{ form.name }</h1>
					<h2 className={ styles.FormField }>Tipo: { form.type }</h2>
					<h2 className={ styles.FormField }>Peso: { form.weight }</h2>
					<Input label='Usuario Evaluado:' type='select' name='evaluated' value={ this.state.evaluated } 
								onChange={ this.onChangeHandler } options={ this.state.users } />
					<p>Descripción: { form.description }</p>
					<h5> ColorScale </h5>
					<SubmitButton onClick={ this.submitForm } text={'Guardar Evaluación'}/>
				</div>
				<div className={ styles.SectionsList }>
					{ this.state.sectionViews }
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchProps = dispatch => {
	return {
	};
};

export default connect( mapStateToProps, mapDispatchProps )( FillableForm );