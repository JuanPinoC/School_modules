import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { Redirect } from "react-router-dom";

import { connect } from 'react-redux';
import { setForm, updateForm, createSection, moveSection, deleteSection, removeFormEditorData } from '../../Store/Actions/FormEditor/index';

import SectionEditor from '../SectionEditor/SectionEditor';
import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

import { getToken, getUrlParams, getForm, FormTypes, FormActions, getColorScales, moveElementInArray, randomNumber } from '../../Functions/FormEditorFunctions';

class formEditor extends Component {

	constructor (props) {

		super(props);

		this.state = {
			id: '',

			sectionViews: [],
			types: FormTypes,
			actions: FormActions,
			colorScales: [],

			disableSubmit: false,
			disableMoveItem: false,
			loading: true,
			redirect: ''
		};

		this.moveSection = this.moveSection.bind(this);
		this.deleteSection = this.deleteSection.bind(this);
	}

	componentDidMount () {

		let colorScalesPromise = new Promise( ( resolve, reject ) => { getColorScales(resolve, reject); });
		colorScalesPromise.then( ( colorScalesRes ) => {
			
			this.setState({ colorScales: colorScalesRes });

			const params = getUrlParams();

			if( params.id !== null && typeof params.id !== 'undefined' ){

				let formPromise = new Promise( ( resolve, reject ) => { getForm( params.id, resolve, reject); });
				formPromise.then( ( res ) => {

					this.props.onSetForm({
						name: res.name,
						type: res.type,
						action: res.action,
						description: res.description,
						sections: res.sections,
						colorScale: res.colorScale
					});

					const sections = res.sections;

					sections.forEach( (e) => {
						this.addSection( e );
					});

					this.setState({
						id: params.id,
						loading: false
					});

				});

			}else{

				this.props.onRemoveFormEditorData();

				this.setState({ loading: false });
			}

		});

	}

	onChangeHandler = (fieldName, e) => {

		this.props.onUpdateForm( fieldName, e.target.value );

	}

	addSection = ( data = null ) => {

		const key = data._id || 's' + randomNumber();

		this.setState( (state, props) => ({ 
			sectionViews: [	...state.sectionViews, 
							(<SectionEditor id={ key } key={ key } data={ data } 
								move={ (action) => { this.moveSection(action, key) } } 
								delete={ () => { this.deleteSection( key ); } } />)	]
		}));


		if( typeof data._id === 'undefined' ){
			
			this.props.onAddSection( key );

		}

	}

	moveSection = ( action, key ) => {

		this.setState({ sectionViews: moveElementInArray( this.state.sectionViews, key, action ) });
		
		this.props.onMoveSection( key, action );

	}

	deleteSection = ( key ) => {
		let sectionViews = this.state.sectionViews;

		const index = sectionViews.findIndex( (e) => e.key === key || e._id === key || e.id === key );

		sectionViews.splice(index, 1);

		this.setState({ sectionViews: sectionViews });

		this.props.onDeleteSection( key );
	}

	onSubmitHandler = (e) => {

		this.setState({ disableSubmit: true });

		const data = {
					name: this.props.name,
					type: this.props.type,
					action: this.props.action,
					description: this.props.description,
					sections: this.props.sections,
					colorScale: this.props.colorScale
				};

		const params = {
			method: 'post',
			url: 'formEditor/create',
			data: data,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + getToken()
			}
		};

		axios(params)
		.then( (res) => {
			alert('Formulario guardado.');
			this.setState({ redirect: '/formList' });
		})
		.catch( (err) => {
			alert('Error al guardar. Intente de nuevo.');
			this.setState({ disableSubmit: false });
		});

	}

	render () {

		if( this.state.redirect !== '' )
			return ( <Redirect to={this.state.redirect} /> );

		const sectionViews = this.state.sectionViews || (<div>Vacío</div>); 

		return ( this.state.loading )?
					(
						<div className={ styles.FormContainer }>
							<h1>Loading</h1>
						</div>
					):(
						<div className={ styles.FormEditorContainer }>
							
							<div className={ styles.TitleContainer }>
								<h1>{ ( this.state.id !== '' )? 'Copia Editada del' : 'Crear' } Formulario</h1>
							</div>
							
							<div className={ styles.FormEditorHeaders}>

								<div className={ styles.FormEditorItem}>
									<Input label='Nombre' type='text' name='name' value={ this.props.name } onChange={ this.onChangeHandler } />
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
							<div className={ styles.TitleContainer}>
								<h1>Secciones del Formulario</h1>
							</div>
							<div className={ styles.SectionsList }>
								{ sectionViews }
							</div>
							<div className={ styles.TitleContainer}>
								<div className={ styles.AddItemButton } onClick={ this.addSection }>
									<h3 className={ styles.HorizontalAlign}>Agregar Sección +</h3>
								</div>
							</div>

							<div className={ styles.ButtonContainer }>
								<SubmitButton text={ ( this.state.id !== '' )?'Guardar Copia Editada':'Crear Formulario' } type='primary' 
												onClick={ this.onSubmitHandler } disabled={ this.state.disableSubmit } />
							</div>
						</div>
					);
	}
}

const mapStateToProps = state => {
	return {
		name: state.formEditor.name,
		type: state.formEditor.type,
		action: state.formEditor.action,
		description: state.formEditor.description,
		sections: state.formEditor.sections,
		colorScale: state.formEditor.colorScale
	};
};

const mapDispatchProps = dispatch => {
	return {
		onSetForm: ( form ) => { dispatch( setForm( form ) ) },
		onUpdateForm: ( field, value ) => { dispatch( updateForm( field, value ) ) },
		onAddSection: ( key ) => { dispatch( createSection( key ) ) },
		onMoveSection: ( key, direction ) => { dispatch( moveSection( key, direction ) ) },
		onDeleteSection: ( key ) => { dispatch( deleteSection( key ) ) },

		onRemoveFormEditorData: () => { dispatch( removeFormEditorData() ) }
	};
};

export default connect( mapStateToProps, mapDispatchProps )( formEditor );