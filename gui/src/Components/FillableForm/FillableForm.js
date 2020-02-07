import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { connect } from 'react-redux';
//import { updateForm, createSection, moveSection, deleteSection } from '../../Store/Actions/FormEditor/index';

import { FormTypes, FormActions, getColorScales, getUsers, moveElementInArray } from '../../Functions/FormEditorFunctions';

import Input from '../Input/Input';

const item = {
	input: '',
	answerString: '',
	answerNumber: 0
};

class FillableForm extends Component {

	constructor( props ){

		super(props);

		this.state = {
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

		this.getForm();

		let usersPromise = new Promise( ( resolve, reject ) => { getUsers(resolve, reject); });
		usersPromise.then( ( res ) => { this.setState({ users: res }); } );

		let colorScalesPromise = new Promise( ( resolve, reject ) => { getColorScales(resolve, reject); });
		colorScalesPromise.then( ( res ) => { this.setState({ colorScales: res }); } );

	}

	getForm = () => {
		
		axios.get(
				'formEditor/find?id=' + '5e3cdab9d6364d2f6cf4da17',
				{ headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken') } } 
		)
		.then( (res) => {
			this.setState({ form: res.data });
			this.getSectionViews();
		})
		.catch( (err) => {
			console.log(err);
			alert('Error');			
		});

	}

	onChangeHandler = ( inputId, e ) => {
		console.log( inputId, e);
		let items = this.state.items;
		items[inputId] = e.target.value;

		this.setState({ items: items });
	}

	getSectionViews = () => {

		const sections = this.state.form.sections || [];

		let sectionViews = sections.map( (section) => {
			return (
				<div key={ section._id }>
					<h4> section.name </h4>
					<h5> section.weight </h5>
					<h5> section.order </h5>
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

			if(input.evaluatedUserField) this.setState({ evaluatedUserFields: [ ...this.state.evaluatedUserFields, input._id ] }) ;

			switch(input.type){
				case 'Number':
					return(
						<div order={ input.order } >
							<Input label={ input.label } type='number' name={ input._id } value={ this.items[input._id] } 
									onChange={ this.onChangeHandler } 
									max={ input.maxValue }
									min={ input.minValue } />
						</div>
					);
					break;

				case 'Text':
					return(
						<div order={ input.order } >
							<Input label={ input.label } type='textarea' name={ input._id } value={ this.items[input._id] } 
									onChange={ this.onChangeHandler } 
									max={ input.maxValue }
									min={ input.minValue } />
						</div>
					);
					break;

				case 'Number Options':
					return(
						<div order={ input.order } >
							<Input label={ input.label } type='radiobuttons' name={ input._id } value={ this.items[input._id] } 
									onChange={ this.onChangeHandler } 
									options={ input.options } />
						</div>
					);
					break;

				case 'Text Options':
					return(
						<div order={ input.order } >
							<Input label={ input.label } type='radiobuttons' name={ input._id } value={ this.items[input._id] } 
									onChange={ this.onChangeHandler } 
									options={ input.options } />
						</div>
					);
					break;

			}

		});

		return inputViews;
	}

	render () {

		const form = { ...this.state.form, sections: [] };

		return (
			<div className={ styles.FillableFormContainer }>
				<div className={ styles.FormFields}>
					<h2>{ form.name }</h2>
					<h3>{ form.type }</h3>
					<h5>{ form.weight }</h5>
					<p>{ form.description }</p>
					<h5> ColorScale </h5>
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