import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { connect } from 'react-redux';
import { updateForm, createSection, moveSection, deleteSection } from '../../Store/Actions/FormEditor/index';

import SectionEditor from '../SectionEditor/SectionEditor';

import { moveElementInArray } from '../../Functions/FormEditorFunctions';

class formEditor extends Component {

	constructor (props) {

		super(props);

		this.state = {
			sectionViews: [],
			colorScales: []
		}
		this.moveSection = this.moveSection.bind(this);
		this.deleteSection = this.deleteSection.bind(this);
	}

	componentDidMount () {

		const sections = this.props.sections;

		sections.forEach( (e) => {
			this.addSection( e );
		});

	}

	componentDidMount(){
		this.getColorScales();
	}

	getColorScales = () => {
		
		axios.get(
					'colorScale/',
					{ headers: { 'Authorization': 'Bearer' + sessionStorage.getItem('jwtToken') }} 
			)
			.then( ( res ) => {

				this.setState({ colorScale: res.data.records });

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
/*
		let obj = {};

		const formData = new formData();

		const params = {
			method: 'post',
			url: url,
			data: obj,
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
			}
		};

		axios(params)
		.then( (res) => {

			console.log('Created');

		})
		.catch( (res) => {
			alert('Error');
		});
*/
	}

	render () {

		const sectionViews = this.state.sectionViews || (<div>Vacío</div>); 

		return (
			<div className={ styles.FormEditorContainer }>
				<div className={ styles.FormEditorHeaders}>
					<div className={ styles.FormEditorItem}>
						<label>Nombre: </label>
						<input className={ styles.FormEditorName } type='text' value={ this.props.name } 
								onChange={ (e) => {this.onChangeHandler('name', e)} } />
					</div>
					<div className={ styles.FormEditorItem}>
						<label>Peso: </label>
						<input className={ styles.FormEditorWeight } type='number' value={ this.props.weight }
								onChange={ (e) => {this.onChangeHandler('weight', e)} } />
					</div>
					<div className={ styles.FormEditorItem}>
						<label>Tipo: </label>
						<select className={ styles.FormEditorSelect } 
								onChange={ (e) => {this.onChangeHandler('type', e)} }>
							<option value='Soft Abilities'>Habilidades blandas</option>
							<option value='Hard Abilities'>Observación en clase</option>
							<option value='Interview'>Entrevista</option>
						</select>
					</div>
					<div className={ styles.FormEditorItem}>
						<label>Acción: </label>
						<select className={ styles.FormEditorSelect } 
								onChange={ (e) => {this.onChangeHandler('action', e)} }>
							<option value='sum'>Sumar</option>
							<option value='avg'>Promediar</option>
							<option value='none'>Ninguna</option>
						</select>
					</div>
					<div className={ styles.FormEditorItem}>
						<label>Descripción: </label>
						<input className={ styles.FormEditorName } type='text' value={ this.props.description } 
								onChange={ (e) => {this.onChangeHandler('description', e)} } />
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
		sections: state.formEditor.sections
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