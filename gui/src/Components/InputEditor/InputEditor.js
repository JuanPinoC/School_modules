import React, { Component } from 'react';
import styles from './Styles.css';

import OptionEditor from '../OptionEditor/OptionEditor';
import ActionButtons from '../ActionButtons/ActionButtons';

class inputEditor extends Component {

	constructor(props){
		super(props);

		const data = props.data;

		this.state = (data != null )?
		{
			label:	data.label,
			type:	data.type,
			weight: data.weight,
			optionsData: data.options,
			optionViews: [],
			maxValue: data.maxValue,
			minValue: data.minValue
		}:{
			label:	'',
			type:	'Number',
			weight: 0,
			optionsData: [],
			optionViews: [],
			maxValue: null,
			minValue: null
		}

		this.moveOption = this.moveOption.bind(this);
		this.deleteOption = this.deleteOption.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	componentDidMount () {

		let optionsData = this.state.optionsData;

		optionsData.forEach( (e) => {
			this.addOption( e );
		});

	}

	addOption = ( data = null ) => {

		const key = 'i' + Math.round(Math.random() * 1000);

		this.setState( (state, props) => ({ 
			optionViews: [	...state.optionViews, 
							(<OptionEditor key={ key } data={ data } 
								move={ (action) => { this.moveOption(action, key) } } 
								delete={ () => { this.deleteOption( key ) } } />)	]
		}));

	}

	moveOption = ( action, key ) => {

		let optionViews = this.state.optionViews;

		const index = optionViews.findIndex( (e) => e.key === key );

		if(action === 'up' && index !== 0){
			const x = optionViews[ index - 1];
			const y = optionViews[ index ];

			optionViews[ index - 1 ] = y;
			optionViews[ index ] = x ;
		}
		else if( action === 'down' && index !== optionViews.length - 1 ){
			const x = optionViews[ index + 1];
			const y = optionViews[ index ];

			optionViews[ index + 1 ] = y;
			optionViews[ index ] = x ;
		}

		this.setState({ optionViews: optionViews });

	}

	deleteOption = ( key ) => {

		let optionViews = this.state.optionViews;

		const index = optionViews.findIndex( (e) => e.key === key );

		optionViews.splice(index, 1);

		this.setState({ optionViews: optionViews });

	}


	render(){

		const optionViews = this.state.optionViews || (<div>Sin opciones</div>); 
		
		return(
			<div className={ styles.InputEditorContainer }>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
				<div className={ styles.InputEditorHeaders}>
	
					<div className={ styles.InputEditorItem}>				
						<label>Enunciado: </label>
						<input className={ styles.InputEditorLabel } type='text' value={ this.state.label } 
								onChange={ (e) => {this.onChangeHandler('label', e)} } />
					</div>
					<div className={ styles.InputEditorItem}>
						<label>Tipo: </label>
						<select className={ styles.InputEditorSelect } 
								onChange={ (e) => {this.onChangeHandler('type', e)} }>
							<option value='Number'>Númerica</option>
							<option value='Text'>Textual</option>
							<option value='Number Options'>Opción Múltiple Númerica</option>
							<option value='Text Options'>Opción Múltiple Textual</option>
						</select>
					</div>
					<div className={ styles.InputEditorItem}>
						<label>Peso: </label>
						<input className={ styles.InputEditorWeight } type='number' value={ this.state.weight }
								onChange={ (e) => {this.onChangeHandler('weight', e)} } />
					</div>
					<div className={ styles.InputEditorItem}>
						<label>Max: </label>
						<input className={ styles.InputEditorLimit } type='number' value={ this.state.maxValue }
								onChange={ (e) => {this.onChangeHandler('maxValue', e)} } />
					</div>
					<div className={ styles.InputEditorItem}>
						<label>Min: </label>
						<input className={ styles.InputEditorLimit } type='number' value={ this.state.minValue }
								onChange={ (e) => {this.onChangeHandler('minValue', e)} } />
					</div>
				</div>
				<div className={ styles.OptionList }>
					{ (optionViews.length > 0 )? 'Opciones:':'' }
					<div>
						{ optionViews }
					</div>
				</div>
				<div className={ styles.AddOptionButton } onClick={ this.addOption }>
					<h1 className={ styles.HorizontalAlign}>+</h1>
					<h3 className={ styles.HorizontalAlign}>Agregar Opción</h3>
				</div>
			</div>
		);
	}

}

export default inputEditor;