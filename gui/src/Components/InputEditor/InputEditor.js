import React, { Component } from 'react';
import styles from './Styles.css';

class inputEditor extends Component {

	constructor(props){
		super(props);

		const data = props.data;

		this.state = {
			label:	data.label,
			type:	data.type,
			weight: data.weight,
			optionsData: data.options,
			optionsViews: [],
			maxValue: data.maxValue,
			minValue: data.minValue
		}
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	render(){

		const optionViews = this.state.optionViews || (<div>Vacío</div>); 
		
		return(
			<div className={ styles.InputEditorContainer }>
				<div className={ styles.InputEditorHeaders}>
					
					<label>Enunciado: </label>
					<input className={ styles.InputEditorLabel } type='text' value={ this.state.label } 
							onChange={ (e) => {this.onChangeHandler('label', e)} } />

					<label>Tipo: </label>
					<select className={ styles.InputEditorSelect } 
							onChange={ (e) => {this.onChangeHandler('type', e)} }>
						<option value='Number'>Númerica</option>
						<option value='Text'>Textual</option>
						<option value='Number Options'>Opción Múltiple Númerica</option>
						<option value='Text Options'>Opción Múltiple Textual</option>
					</select>

					<label>Peso: </label>
					<input className={ styles.InputEditorWeight } type='number' value={ this.state.weight }
							onChange={ (e) => {this.onChangeHandler('weight', e)} } />

					<label>Max: </label>
					<input className={ styles.InputEditorLimit } type='number' value={ this.state.maxValue }
							onChange={ (e) => {this.onChangeHandler('maxValue', e)} } />

					<label>Min: </label>
					<input className={ styles.InputEditorLimit } type='number' value={ this.state.minValue }
							onChange={ (e) => {this.onChangeHandler('minValue', e)} } />

				</div>
				<div className={ styles.OptionList }>
					{ optionViews }
				</div>
			</div>
		);
	}

}

export default inputEditor;