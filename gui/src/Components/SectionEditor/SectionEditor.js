import React, { Component } from 'react';
import styles from './Styles.css';

import { connect } from 'react-redux';
import { updateSection, createInput, moveInput, deleteInput } from '../../Store/Actions/FormEditor/index';

import Input from '../Input/Input';

import InputEditor from '../InputEditor/InputEditor';
import ActionButtons from '../ActionButtons/ActionButtons';

import { FormActions, InputTypes, moveElementInArray } from '../../Functions/FormEditorFunctions';

class sectionEditor extends Component {

	constructor (props) {
		
		super(props);

		this.state = {
			inputViews: [],
			inputTypes: InputTypes
		};

		this.moveInput = this.moveInput.bind(this);
		this.deleteInput = this.deleteInput.bind(this);

		this.onChangeHandler = this.onChangeHandler.bind(this);
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

		const index = inputViews.findIndex( (e) => e.key === key || e._id === key || e.id === key );

		inputViews.splice(index, 1);

		this.setState({ inputViews: inputViews });

		this.props.onDeleteInput( this.props.id, key );
	}

	render () {

		const inputViews = this.state.inputViews || (<div>Vacío</div>); 

		return (
			<div className={ styles.SectionEditorContainer }>

				<div className={ styles.TitleContainer}>
					<ActionButtons move={ this.props.move } delete={ this.props.delete } />
					<h2>Sección {this.props.order + 1}</h2>
				</div>
			
				<div className={ styles.SectionEditorHeaders}>
					<div className={ styles.SectionEditorItem}>
						<Input label='Nombre' type='text' name='name' value={ this.props.name } onChange={ this.onChangeHandler } color='white' />
					</div>
					<div className={ styles.SectionEditorItem}>
						<Input label='Peso' type='number' name='weight' value={ this.props.weight } onChange={ this.onChangeHandler } color='white' />
					</div>
					<div className={ styles.SectionEditorItem}>
						<Input label='Acción' type='select' name='action' options={ FormActions }
								value={ this.props.action } onChange={ this.onChangeHandler } color='white' />
					</div>
				</div>
				<div className={ styles.InputsList }>
					{ inputViews }
				</div>
				<div className={ styles.AddInputButton } onClick={ this.addInput }>
					<h3 className={ styles.HorizontalAlign}>Agregar Pregunta +</h3>
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
		inputs: sections[ id ].inputs,
		order: id
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