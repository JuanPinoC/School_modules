import React, { Component } from 'react';
import styles from './Styles.css';

import { connect } from 'react-redux';
import { updateInput } from '../../Store/Actions/FormEditor/index';

import Input from '../Input/Input';
import OptionEditor from '../OptionEditor/OptionEditor';
import ActionButtons from '../ActionButtons/ActionButtons';

import { moveElementInArray } from '../../Functions/FormEditorFunctions';


const optionBaseForm = {	
							key: '',
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

		this.onChangeHandler = this.onChangeHandler.bind(this);
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

			this.props.onUpdateInput( this.props.parent, this.props.id, 'options', [ ...this.props.options, { ...optionBaseForm, key: key } ] );

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
				<div className={ styles.TitleContainer}>
					<ActionButtons move={ this.props.move } delete={ this.props.delete } />
					<h3>Pregunta {this.props.order + 1}</h3>
					<div className={ styles.TitleItem }>				
						<Input label='Campo para el evaluado' type='checkbox' name='evaluatedUserField' value={ this.props.evaluatedUserField } 
								onChange={ this.onChangeHandler } />
					</div>
				</div>

				<div className={ styles.InputEditorHeaders}>
	
					<div className={ styles.InputEditorItem}>
						<Input label='Enunciado' type='text' name='label' value={ this.props.label } onChange={ this.onChangeHandler } />
					</div>
					<div className={ styles.InputEditorItem}>
						<Input label='Tipo' type='select' name='type' value={ this.props.type } 
							options={ inputTypes.map( ( e ) => { return { _id: e.value, name: e.label}; } ) } onChange={ this.onChangeHandler } />
					</div>
					
					{	( showItemsConfig.showWeight )?(
						<div className={ styles.InputEditorItem}>
							<Input label='Peso' type='number' name='weight' value={ this.props.weight } 
									onChange={ this.onChangeHandler } />
						</div>
						):('')	}
					
					{	( showItemsConfig.showMaxValue )?(
						<div className={ styles.InputEditorItem }>
							<Input label='Max' type='number' name='maxValue' value={ this.props.maxValue } 
									onChange={ this.onChangeHandler } />
						</div>
						):('')	}

					{	( showItemsConfig.showMinValue )?(
						<div className={ styles.InputEditorItem}>
							<Input label='Min' type='number' name='minValue' value={ this.props.minValue } 
									onChange={ this.onChangeHandler } />
						</div>
						):('')	}
				</div>

				<div  className={ styles.OptionsList }>
					{	( showItemsConfig.showOptions )?(
						<div>
							{ (optionViews.length > 0 )? 'Opciones:':'' }
							<div>
								{ optionViews }
							</div>
						</div>
					):('')	}

					{	( showItemsConfig.showOptions )?(
						<div className={ styles.AddOptionButton } onClick={ this.addOption }>
							<h4 className={ styles.HorizontalAlign}>Agregar Opción +</h4>
						</div>
					):('')	}
				</div>

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
		minValue: parentInputs[ id ].minValue,
		evaluatedUserField: parentInputs[ id ].evaluatedUserField,
		order: id

	} : {};
};

const mapDispatchProps = dispatch => {
	return {
		onUpdateInput: ( parent, key, field, value ) => dispatch( updateInput( parent, key, field, value ) ),
	};
};

export default connect( mapStateToProps, mapDispatchProps )( inputEditor );
