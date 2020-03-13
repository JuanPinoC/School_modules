import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { Redirect } from "react-router-dom";

import { connect } from 'react-redux';

import { getToken, getUrlParams, isEvaluatedUser, FormTypes, FormActions, getColorScale, getUser, getForm, getRecord, moveElementInArray, randomNumber } from '../../Functions/FormEditorFunctions';

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

const item = {
	input: '',
	answer: null
};


class InputView extends Component {

	constructor( props ){
		
		super(props);

		this.state = {
			input: this.props.input,
			value: this.props.value,
			disabled: this.props.disabled
		}

		this.onChangeHandler = this.onChangeHandler.bind(this);

	}

	componentDidMount(){
		const input = this.state.input;
		
		if( input.type === 'Number' && this.state.value === 0 ){
			this.props.onChange( this.state.input._id, { target: { value: ( input.minValue > 0 )? input.minValue : 0 } } );
		}

	}

	onChangeHandler = ( name, e ) => {
		this.props.onChange( this.state.input._id, e );
		this.setState({ value: e.target.value });
	}

	render(){

		const disabled = this.state.disabled;
		const inputValue = this.state.value;
		const input = this.state.input;
		let inputItemView = (<div></div>);

		switch(input.type){
			case 'Number':
				inputItemView = (
					<Input label={''} type='number' name={ input._id } value={ inputValue } 
							onChange={ this.onChangeHandler } 
							max={ input.maxValue }
							min={ input.minValue }
							disabled={ disabled } />

				);
				break;

			case 'Text':
				inputItemView = (
					<Input label={''} type='textarea' name={ input._id } value={ inputValue } 
							onChange={ this.onChangeHandler } 
							max={ input.maxValue }
							min={ input.minValue }
							disabled={ disabled } />
				);
				break;

			case 'Number Options':

				inputItemView = (
					<Input label={''} type='radiobuttons' name={ input._id } value={ inputValue } 
							onChange={ this.onChangeHandler } 
							options={ input.options }
							disabled={ disabled } />
				);
				break;

			case 'Text Options':
				inputItemView = (
						<Input label={''} type='radiobuttons' name={ input._id } value={ inputValue } 
								onChange={ this.onChangeHandler } 
								options={ input.options }
								disabled={ disabled } />
				);
				break;

		}

		return (<div className={ styles.InputItemContainer }>
					<label className={ styles.InputItemLabel }>{ input.label }<span>{( input.evaluatedUserField )? ' (Campo del evaluado)' : ' (Campo del evaluador)' }</span></label>
					{ inputItemView }
				</div>);

	}

};



class FillableForm extends Component {

	constructor( props ){

		super(props);

		this.state = {
			id: '',
			plan: '',
			planItemId: '',
			evaluated: '',
			form: {},
			items: [],

			formTypes: FormTypes,
			colorScale: {},
			evaluatedUserFields: [],
			isEvaluatedUser: true,

			disableSubmit: false,
			loading: true,
			redirect: ''
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	componentDidMount () {

		const params = getUrlParams();

		if( params.planId !== null && typeof params.planId !== 'undefined' && 
			params.planFormItemId !== null && typeof params.planFormItemId !== 'undefined' &&
			params.formId !== null && typeof params.formId !== 'undefined' &&
			params.userId !== null && typeof params.userId !== 'undefined' &&
			params.userName !== null && typeof params.userName !== 'undefined' ){

			let evaluatedUserPromise = new Promise( ( resolve, reject ) => { isEvaluatedUser( params.userId, resolve, reject ); });
			evaluatedUserPromise.then( ( resEvaluatedUser ) => {

				let formPromise = new Promise( ( resolve, reject ) => { getForm( params.formId, resolve, reject ); });
				formPromise.then( ( resForm ) => {

					let colorScalePromise = new Promise( ( resolve, reject ) => { getColorScale( resForm.colorScale, resolve, reject ); });
					colorScalePromise.then( ( resColorScale ) => { 

						this.setState({ 
							plan: params.planId,
							planItemId: params.planFormItemId,
							evaluated: params.userId,
							evaluatedName: decodeURIComponent(params.userName),
							form: resForm,
							colorScale: resColorScale,
							isEvaluatedUser: resEvaluatedUser.isEvaluatedUser
						});

						this.getSectionViews();

					});
				
				});

			});

		}else if( params.id !== null && typeof params.id !== 'undefined'){

			let recordPromise = new Promise( ( resolve, reject ) => { getRecord( params.id, resolve, reject ); });
			recordPromise.then( ( record ) => {

				let evaluatedUserPromise = new Promise( ( resolve, reject ) => { isEvaluatedUser( record.evaluated._id, resolve, reject ); });
				evaluatedUserPromise.then( ( resEvaluatedUser ) => {

					let formPromise = new Promise( ( resolve, reject ) => { getForm( record.form, resolve, reject ); });
					formPromise.then( ( resForm ) => {

						let colorScalePromise = new Promise( ( resolve, reject ) => { getColorScale( resForm.colorScale, resolve, reject ); });
						colorScalePromise.then( ( resColorScale ) => { 

							let formInputs = [];
							resForm.sections.forEach( (section) => {
								formInputs = [ ...formInputs, ...section.inputs ];
							});

							let items = [];

							record.items.forEach( (e) => {

								const inputIndex = formInputs.findIndex( (input) => input._id + '' === e.input + '');

								switch( formInputs[inputIndex].type ){
									case 'Text':
										items.push({
											input: e.input + '',
											answer: e.answerString
										});
										break;
									case 'Number':
										items.push({
											input: e.input + '',
											answer: e.answerNumber
										});
										break;
									case 'Number Options':
									case 'Text Options':
										items.push({
											input: e.input + '',
											answer: e.answerId
										});
										break;
								}

							});


							this.setState({
								id: params.id,
								plan: record.plan,
								planItemId: record.planItemId,
								evaluated: record.evaluated._id,
								evaluatedName: record.evaluated.name,
								form: resForm,
								colorScale: resColorScale,
								isEvaluatedUser: resEvaluatedUser.isEvaluatedUser,
								items: items
							});

							this.getSectionViews();

						});
					
					});

				});

			});
			
		}

	}

	onChangeHandler = ( inputId, e ) => {

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
					<div className={ styles.InputsList }>
						{ this.getInputViews(section.inputs) }
					</div>
				</div>
			);
		});

		this.setState({ sectionViews: sectionViews, loading: false });

	}

	getInputViews = ( inputs ) => {

		let inputViews = inputs.map( (input) => {

			if( input.evaluatedUserField ) this.setState({ evaluatedUserFields: [ ...this.state.evaluatedUserFields, input._id ] });

			const key = 'i' + randomNumber();

			let inputItemView = (<div></div>);

			let inputValueIndex = this.state.items.findIndex( (stateItem) => stateItem.input + '' === input._id + '' );

			let inputValue = ( inputValueIndex >= 0 )? this.state.items[inputValueIndex].answer : ( input.type === 'Number' )? 0 : '' ;




			return(<InputView key={ key } input={ input } value={ inputValue } onChange={ this.onChangeHandler } 
								disabled={ !( this.state.isEvaluatedUser === input.evaluatedUserField ) }/>);

		});

		return inputViews;
	}

	getColorScaleView = () => {

		const colorScale = this.state.colorScale;

		if( typeof colorScale.items !== 'undefined' ){

			const colorItems = colorScale.items.map( (e) => {
				return (<tr key={ randomNumber() }>
							<td>{ e.label }</td>
							<td className={ styles.ColorScaleItemColor }>
								<div style={{ backgroundColor: e.color}}>{ e.max + ' - ' + e.min }</div>
							</td>
						</tr>);
			});

			return (<div className={ styles.ColorScaleContainer }>
						<table>	
							<thead>
								<tr><th colSpan="2">{ colorScale.name }</th></tr>
							</thead>
							<tbody>
								{ colorItems }
							</tbody>
						</table>
					</div>);

		}else{
			return (<div></div>);
		}

	}

	submitForm = () => {

		this.setState({ disableSubmit: true });

		const state = this.state;

		const data = {
			id: state.id,
			plan: state.plan,
			planItemId: state.planItemId,
			form: state.form._id,
			evaluated: state.evaluated,
			items: state.items
		};

		const url = ( data.id === '' )? 'record/create' : 'record/update';

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
			if(res.data.message === 'Already completed'){
				alert('El registro ya ha sido completado con anterioridad.');	
			}else {
				alert('Evaluación guardada.');
			}

			this.setState({ redirect: '/' });
		})
		.catch( (err) => {
			alert('Error al guardar. Intente de nuevo.');
			this.setState({ disableSubmit: false });
		});

	}

	render () {

		if( this.state.redirect !== '' )
			return ( <Redirect to={this.state.redirect} /> );

		if( this.state.loading )
			return (<div className={ styles.FillableFormContainer }><h1 className={ styles.SectionsList }>Loading</h1></div>);

		const form = { ...this.state.form, sections: [] };

		const colorScaleView = this.getColorScaleView();

		return (
			<div className={ styles.FillableFormContainer }>
				<div className={ styles.FormFields}>
					<div className={ styles.div1 }><h1>{ form.name }</h1></div>
					<div className={ styles.div2 }><h2>Tipo: { form.type }</h2></div>
					<div className={ styles.div5 }><h2>Evaluado: { this.state.evaluatedName }</h2></div>
					<div className={ styles.div4 }><p>Descripción: </p><pre>{ form.description }</pre></div>
					<div className={ styles.div3 }>{ colorScaleView }</div>
				</div>
				<div className={ styles.SectionsList }>
					{ this.state.sectionViews }
				</div>
				<div className={ styles.ButtonContainer }>
					<SubmitButton onClick={ this.submitForm } text={'Guardar Evaluación'} disabled={ this.state.disableSubmit }/>
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