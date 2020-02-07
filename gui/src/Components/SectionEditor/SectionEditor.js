import React, { Component } from 'react';
import styles from './Styles.css';

import { connect } from 'react-redux';
import { updateSection, createInput, moveInput, deleteInput } from '../../Store/Actions/FormEditor/index';

import InputEditor from '../InputEditor/InputEditor';
import ActionButtons from '../ActionButtons/ActionButtons';

import { InputTypes, moveElementInArray } from '../../Functions/FormEditorFunctions';

class sectionEditor extends Component {

	constructor (props) {
		
		super(props);

		this.state = {
			inputViews: [],
			inputTypes: InputTypes
		};

		this.moveInput = this.moveInput.bind(this);
		this.deleteInput = this.deleteInput.bind(this);
	}

	onChangeHandler = (fieldName, e) => {

		this.props.onUpdateSection( this.props.id, fieldName, e.target.value);

	}

	componentDidMount () {

		let inputs = this.props.inputs;

		inputs.forEach( (e) => {
			this.addInput( e );			
		});

	}

	addInput = ( data = null ) => {

		const key = data._id || 'i' + Math.round(Math.random() * 1000);
		
		this.setState( (state, props) => ({ 
			inputViews: [	...state.inputViews, 
							(<InputEditor id={ key } key={ key } data={ data } parent={ this.props.id }
								inputTypes={ this.state.inputTypes }
								move={ (action) => { this.moveInput(action, key) } } 
								delete={ () => { this.deleteInput( key ); } } />)	]
		}));

		this.props.onAddInput( this.props.id, key );

	}

	moveInput = ( action, key ) => {

		this.setState({ inputViews: moveElementInArray( this.state.inputViews, key, action ) });

		this.props.onMoveInput( this.props.id, key, action );

	}

	deleteInput = ( key ) => {
		
		let inputViews = this.state.inputViews;

		const index = inputViews.findIndex( (e) => e.key === key );

		inputViews.splice(index, 1);

		this.setState({ inputViews: inputViews });

		this.props.onDeleteInput( this.props.id, key );
	}

	render () {

		const inputViews = this.state.inputViews || (<div>Vacío</div>); 

		return (
			<div className={ styles.SectionEditorContainer }>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
				<div className={ styles.SectionEditorHeaders}>
					<div className={ styles.SectionEditorItem}>
						<label>Nombre de la sección: </label>
						<input className={ styles.SectionEditorName } type='text' value={ this.props.name } 
								onChange={ (e) => {this.onChangeHandler('name', e)} } />
					</div>
					<div className={ styles.SectionEditorItem}>
						<label>Peso: </label>
						<input className={ styles.SectionEditorWeight } type='number' value={ this.props.weight }
								onChange={ (e) => {this.onChangeHandler('weight', e)} } />
					</div>
					<div className={ styles.SectionEditorItem}>
						<label>Acción: </label>
						<select className={ styles.SectionEditorSelect } 
								onChange={ (e) => {this.onChangeHandler('action', e)} }>
							<option value='sum'>Sumar</option>
							<option value='avg'>Promediar</option>
							<option value='text'>Ninguna</option>
						</select>
					</div>
				</div>
				<div className={ styles.InputsList }>
					{ inputViews }
				</div>
				<div className={ styles.AddInputButton } onClick={ this.addInput }>
					<h1 className={ styles.HorizontalAlign}>+</h1>
					<h3 className={ styles.HorizontalAlign}>Agregar Pregunta</h3>
				</div>
				
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {

	const sections = state.formEditor.sections;
	const id = sections.findIndex( (e) => e.key === ownProps.id );

	return ( id >= 0 )?
	{
		name: sections[ id ].name,
		weight: sections[ id ].weight,
		action: sections[ id ].action,
		inputs: sections[ id ].inputs
	} : {};
};

const mapDispatchProps = dispatch => {
	return {
		onUpdateSection: ( key, field, value ) => dispatch( updateSection(key, field, value ) ),
		onAddInput: ( parent, key ) => dispatch( createInput( parent, key ) ),
		onMoveInput: ( parent, key, direction ) => dispatch( moveInput( parent, key, direction ) ),
		onDeleteInput: ( parent, key ) => dispatch( deleteInput( parent, key ) )
	};
};

export default connect( mapStateToProps, mapDispatchProps )( sectionEditor );