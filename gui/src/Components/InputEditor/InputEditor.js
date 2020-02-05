import React, { Component } from 'react';
import styles from './Styles.css';

import { connect } from 'react-redux';
import { updateInput } from '../../Store/Actions/FormEditor/index';

import OptionEditor from '../OptionEditor/OptionEditor';
import ActionButtons from '../ActionButtons/ActionButtons';

import { moveElementInArray } from '../../Functions/FormEditorFunctions';


const optionBaseForm = {
							label: '', 
							numberValue: 0,
							stringValue: ''
						};

class inputEditor extends Component {

	constructor(props){
		super(props);

		this.state = {
			optionViews: [],
			showItemsConfig: this.getShowItemsConfig( this.props.type || 'Number' )
		};

		this.moveOption = this.moveOption.bind(this);
		this.deleteOption = this.deleteOption.bind(this);

		this.optionFieldChangeHandler = this.optionFieldChangeHandler.bind(this);
	}

	onChangeHandler = (fieldName, e) => {

		this.props.onUpdateInput( this.props.parent, this.props.id, fieldName, (fieldName === 'evaluatedUserField')? e.target.checked : e.target.value );

		if ( fieldName === 'type') {
			this.setState({ showItemsConfig: this.getShowItemsConfig( e.target.value ) });
		}

	}

	optionFieldChangeHandler = ( key, field, value ) => {

		let options = this.props.options;

		const index = options.findIndex( (e) => e.key === key );

		options[ index ] = {...options[ index ], [field]: value};

		this.props.onUpdateInput( this.props.parent, this.props.id, 'options', options );

	}

	getShowItemsConfig = ( value ) => {

		const inputTypes = this.props.inputTypes;
		const element = inputTypes.find( e => e.value === value );
		return element.config;

	}

	componentDidMount () {

		let options = this.props.options;

		options.forEach( (e) => {
			this.addOption( e );
		});
		
	}

	addOption = ( data = null ) => {

		const key = data._id || 'o' + Math.round(Math.random() * 1000);

		this.setState( (state, props) => ({
			optionViews: [	...state.optionViews,
							(<OptionEditor id={ key } key={ key } data={ data } parent={ this.id }
								onFieldChangeHandler={ this.optionFieldChangeHandler } 
								move={ (action) => { this.moveOption(action, key) } }
								delete={ () => { this.deleteOption( key ) } } />)	]
		}));

		if( typeof data._id === 'undefined' ){

			this.props.onUpdateInput( this.props.parent, this.props.id, 'options', [ ...this.props.options, { ...optionBaseForm } ] );

		}

	}

	moveOption = ( action, key ) => {

		this.setState({ optionViews: moveElementInArray( this.state.optionViews, key, action ) });
		this.props.onUpdateInput( this.props.parent, this.props.id, 'options', [ moveElementInArray( this.props.options, key, action ) ]);

	}

	deleteOption = ( key ) => {

		let optionViews = this.state.optionViews;

		const index = optionViews.findIndex( (e) => e.key === key );

		optionViews.splice(index, 1);

		this.setState({ optionViews: optionViews });

		let options = this.props.options;

		options.splice(index, 1);

		this.props.onUpdateInput( this.props.parent, this.props.id, 'options', options);

	}


	render(){

		const inputTypes = this.props.inputTypes;
		const inputType = this.props.type;
		const optionViews = this.state.optionViews;
		const showItemsConfig = this.state.showItemsConfig;

		return(
			<div className={ styles.InputEditorContainer }>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
				<div className={ styles.InputEditorHeaders}>
	
					<div className={ styles.InputEditorItem}>				
						<label>Enunciado: </label>
						<input className={ styles.InputEditorLabel } type='text' value={ this.props.label } 
								onChange={ (e) => {this.onChangeHandler('label', e)} } />
					</div>
					<div className={ styles.InputEditorItem}>
						<label>Tipo: </label>
						<select className={ styles.InputEditorSelect } 
								onChange={ (e) => {this.onChangeHandler('type', e)} }
								value={ inputType }>
							{
								inputTypes.map( ( e ) => {
									return ( <option key={ e.value } value={ e.value } >{ e.label }</option> )
								})
							}
						</select>
					</div>
					<div className={ styles.InputEditorItem}>				
						<label>Campo para el evaluado: </label>
						<input className={ styles.InputEditorLabel } type='checkbox' value={ this.props.evaluatedUserField } 
								onChange={ (e) => {this.onChangeHandler('evaluatedUserField', e)} } />
					</div>
					
					{	( showItemsConfig.showWeight )?(
						<div className={ styles.InputEditorItem}>
							<label>Peso: </label>
							<input className={ styles.InputEditorWeight } type='number' value={ this.props.weight }
									onChange={ (e) => {this.onChangeHandler('weight', e)} } />
						</div>
						):('')	}
					
					{	( showItemsConfig.showMaxValue )?(
						<div className={ styles.InputEditorItem }>
							<label>Max: </label>
							<input className={ styles.InputEditorLimit } type='number' value={ this.props.maxValue }
									onChange={ (e) => {this.onChangeHandler('maxValue', e)} } />
						</div>
						):('')	}

					{	( showItemsConfig.showMinValue )?(
						<div className={ styles.InputEditorItem}>
							<label>Min: </label>
							<input className={ styles.InputEditorLimit } type='number' value={ this.props.minValue }
									onChange={ (e) => {this.onChangeHandler('minValue', e)} } />
						</div>
						):('')	}
				</div>

				{	( showItemsConfig.showOptions )?(
					<div className={ styles.OptionList }>
						{ (optionViews.length > 0 )? 'Opciones:':'' }
						<div>
							{ optionViews }
						</div>
					</div>
				):('')	}

				{	( showItemsConfig.showOptions )?(
					<div className={ styles.AddOptionButton } onClick={ this.addOption }>
						<h1 className={ styles.HorizontalAlign}>+</h1>
						<h3 className={ styles.HorizontalAlign}>Agregar Opción</h3>
					</div>
				):('')	}

			</div>
		);
	}

}

const mapStateToProps = (state, ownProps) => {

	const sections = state.formEditor.sections;
	const sectionId = sections.findIndex( (e) => e.key === ownProps.parent );
	const parentInputs = sections[ sectionId ].inputs;
	const id = parentInputs.findIndex( (e) => e.key === ownProps.id );

	return ( id >= 0 )?
	{
		label: parentInputs[ id ].label,
		type: parentInputs[ id ].type,
		weight: parentInputs[ id ].weight,
		options: parentInputs[ id ].options,
		maxValue: parentInputs[ id ].maxValue,
		minValue: parentInputs[ id ].minValue

	} : {};
};

const mapDispatchProps = dispatch => {
	return {
		onUpdateInput: ( parent, key, field, value ) => dispatch( updateInput( parent, key, field, value ) ),
	};
};

export default connect( mapStateToProps, mapDispatchProps )( inputEditor );
