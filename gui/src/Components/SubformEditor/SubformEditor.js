import React, { Component } from 'react';
import styles from './Styles.css';

import InputEditor from '../InputEditor/InputEditor';

class subformEditor extends Component {

	constructor (props) {
	super(props);

	const data = props.data;

		this.state = {
			name: data.name,
			weight: data.weight,
			type: data.type,
			inputsData: data.inputs,
			inputViews: []
		}
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	componentDidMount () {

		let inputsData = this.state.inputsData;
		let inputViews = [];

		inputsData.forEach( (e) => {
			inputViews.push(<InputEditor data={e} delete={ this.deleteInput } />);			
		});

		this.setState({ inputViews: inputViews });

	}

	addInput = () => {

		let inputViews = this.state.inputViews;

		//inputViews.push(<InputEditor data={ } delete={ this.deleteInput } />);

		this.setState({ inputViews: inputViews });

	}

	deleteInput = ( id ) => {
		
	}

	render () {

		const inputViews = this.state.inputViews || (<div>Vacío</div>); 

		return (
			<div className={ styles.SubformEditorContainer }>
				<div className={ styles.SubformEditorHeaders}>
					<label>Nombre de la sección: </label>
					<input className={ styles.SubformEditorName } type='text' value={ this.state.name } 
							onChange={ (e) => {this.onChangeHandler('name', e)} } />
					
					<label>Peso: </label>
					<input className={ styles.SubformEditorWeight } type='number' value={ this.state.weight }
							onChange={ (e) => {this.onChangeHandler('weight', e)} } />
					
					<label>Acción: </label>
					<select className={ styles.SubformEditorSelect } 
							onChange={ (e) => {this.onChangeHandler('type', e)} }>
						<option value='sum'>Sumar</option>
						<option value='avg'>Promediar</option>
						<option value='text'>Ninguna</option>
					</select>
				</div>
				<div className={ styles.InputList }>
					{ inputViews }
				</div>
			</div>
		);
	}
}

export default subformEditor;