import React, { Component } from 'react';
import styles from './Styles.css';

import InputEditor from '../InputEditor/InputEditor';

class subformEditor extends Component {

	constructor (props) {
	super(props);

	const data = props.data;

		this.state = ( data != null )?
		{
			name: data.name,
			weight: data.weight,
			type: data.type,
			inputsData: data.inputs,
			inputViews: []
		}:{
			name: '',
			weight: 0,
			type: 'sum',
			inputsData: [],
			inputViews: []
		}

		this.deleteInput = this.deleteInput.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	componentDidMount () {

		let inputsData = this.state.inputsData;
		let inputViews = [];

		inputsData.forEach( (e) => {
			const key = 'i' + Math.round(Math.random() * 1000);
			inputViews.push(<InputEditor key={ key } data={e} delete={ () => { this.deleteInput( key ); } } />);			
		});

		this.setState({ inputViews: inputViews });

	}

	addInput = () => {

		let inputViews = this.state.inputViews;

		const key = 'i' + Math.round(Math.random() * 1000);

		inputViews.push(<InputEditor key={ key } data={ null } delete={ () => { this.deleteInput( key ); } } />);

		this.setState({ inputViews: inputViews });

	}

	deleteInput = ( key ) => {
		
		let inputViews = this.state.inputViews;

		const index = inputViews.findIndex( (e) => e.key === key );

		inputViews.splice(index, 1);

		this.setState({ inputViews: inputViews });
	}

	render () {

		const inputViews = this.state.inputViews || (<div>Vacío</div>); 

		return (
			<div className={ styles.SubformEditorContainer }>
				<div className={ styles.removeItemButton } onClick={ this.props.delete }>X</div>
				<div className={ styles.SubformEditorHeaders}>
					<div className={ styles.SubformEditorItem}>
						<label>Nombre de la sección: </label>
						<input className={ styles.SubformEditorName } type='text' value={ this.state.name } 
								onChange={ (e) => {this.onChangeHandler('name', e)} } />
					</div>
					<div className={ styles.SubformEditorItem}>
						<label>Peso: </label>
						<input className={ styles.SubformEditorWeight } type='number' value={ this.state.weight }
								onChange={ (e) => {this.onChangeHandler('weight', e)} } />
					</div>
					<div className={ styles.SubformEditorItem}>
						<label>Acción: </label>
						<select className={ styles.SubformEditorSelect } 
								onChange={ (e) => {this.onChangeHandler('type', e)} }>
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

export default subformEditor;