import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { connect } from 'react-redux';
import { updateForm, createSection, moveSection, deleteSection } from '../../Store/Actions/FormEditor/index';

import SectionEditor from '../SectionEditor/SectionEditor';
import Input from '../Input/Input';

import { moveElementInArray } from '../../Functions/FormEditorFunctions';

class formEditor extends Component {

	constructor (props) {

		super(props);

		this.state = {
			sectionViews: [],
			types: [],
			actions: [],
			colorScales: []
		};

		this.moveSection = this.moveSection.bind(this);
		this.deleteSection = this.deleteSection.bind(this);
	}

	componentDidMount () {

		this.getTypes();
		this.getActions();
		this.getColorScales();

		const sections = this.props.sections;

		sections.forEach( (e) => {
			this.addSection( e );
		});

	}

	getTypes = () => {

		const types = [
			{ _id:'Soft Abilities' , name:'Habilidades blandas' },
			{ _id:'Hard Abilities' , name:'Observación en clase' },
			{ _id:'Interview' , name:'Entrevista' }
		]

		this.setState({ types: types });

	}

	getActions = () => {

		const actions = [
			{ _id:'sum' , name:'Sumar' },
			{ _id:'avg' , name:'Promediar' },
			{ _id:'none' , name:'Ninguna' }
		]

		this.setState({ actions: actions });
		
	}

	getColorScales = () => {
		
		axios.get(
					'colorScale/',
					{ headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken') }} 
			)
			.then( ( res ) => {
				this.setState({ colorScales: res.data.records });

			})
			.catch( (res) => {
				console.log(res);
			});

	}


	onChangeHandler = (fieldName, e) => {

		this.props.onUpdateForm( fieldName, e.target.value);

	}

	addSection = ( data = null ) => {

		const key = data._id || 's' + Math.round(Math.random() * 1000);

		this.setState( (state, props) => ({ 
			sectionViews: [	...state.sectionViews, 
							(<SectionEditor id={ key } key={ key } data={ data } 
								move={ (action) => { this.moveSection(action, key) } } 
								delete={ () => { this.deleteSection( key ); } } />)	]
		}));

		this.props.onAddSection( key );

	}

	moveSection = ( action, key ) => {

		this.setState({ sectionViews: moveElementInArray( this.state.sectionViews, key, action ) });
		
		this.props.onMoveSection( key, action );

	}

	deleteSection = ( key ) => {
		let sectionViews = this.state.sectionViews;

		const index = sectionViews.findIndex( (e) => e.key === key );

		sectionViews.splice(index, 1);

		this.setState({ sectionViews: sectionViews });

		this.props.onDeleteSection( key );
	}

	saveForm = (e) => {

		let obj = {
					name: this.props.name,
					weight: this.props.weight,
					type: this.props.type,
					action: this.props.action,
					description: this.props.description,
					sections: this.props.sections,
					colorScale: this.props.colorScale
				};

		const params = {
			method: 'post',
			url: 'formEditor/create',
			data: obj,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken')
			}
		};

		axios(params)
		.then( (res) => {

			alert('Formulario guardado.');

		})
		.catch( (res) => {
			console.log(res);
		});

	}

	render () {

		const sectionViews = this.state.sectionViews || (<div>Vacío</div>); 

		return (
			<div className={ styles.FormEditorContainer }>
								<div className={ styles.AddSectionButton } onClick={ this.saveForm }>
						<h2 className={ styles.HorizontalAlign}>Guardar Formulario</h2>
					</div>
				<div className={ styles.FormEditorHeaders}>

					<div className={ styles.FormEditorItem}>
						<Input label='Nombre' type='text' name='name' value={ this.props.name } onChange={ this.onChangeHandler } />
					</div>
					<div className={ styles.FormEditorItem}>
						<Input label='Peso' type='number' name='weight' value={ this.props.weight } onChange={ this.onChangeHandler } />
					</div>
					<div className={ styles.FormEditorItem}>
						<Input label='Tipo' type='select' options={ this.state.types } name='type' 
							value={ this.props.type } onChange={ this.onChangeHandler } />
					</div>
					<div className={ styles.FormEditorItem}>
						<Input label='Acción' type='select' options={ this.state.actions } name='action'
							value={ this.props.action } onChange={ this.onChangeHandler } />
					</div>
					<div className={ styles.FormEditorItem}>
						<Input label='Escala de colores' type='select' options={ this.state.colorScales } name='colorScale'
						value={ this.props.colorScale }	 onChange={ this.onChangeHandler } />
					</div>
					<div className={ styles.FormEditorItem}>
						<Input label='Descripción' type='textarea' name='description' value={ this.props.description } onChange={ this.onChangeHandler } />
					</div>
				</div>
				<div className={ styles.SectionsList }>
					{ sectionViews }
				</div>
				<div className={ styles.AddSectionButton } onClick={ this.addSection }>
					<h1 className={ styles.HorizontalAlign}>+</h1>
					<h3 className={ styles.HorizontalAlign}>Agregar Sección</h3>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		name: state.formEditor.name,
		weight: state.formEditor.weight,
		type: state.formEditor.type,
		action: state.formEditor.action,
		description: state.formEditor.description,
		sections: state.formEditor.sections,
		colorScale: state.formEditor.colorScale
	};
};

const mapDispatchProps = dispatch => {
	return {
		onUpdateForm: ( field, value ) => { dispatch( updateForm( field, value ) ) },
		onAddSection: ( key ) => { dispatch( createSection( key ) ) },
		onMoveSection: ( key, direction ) => { dispatch( moveSection( key, direction ) ) },
		onDeleteSection: ( key ) => { dispatch( deleteSection( key ) ) }
	};
};

export default connect( mapStateToProps, mapDispatchProps )( formEditor );