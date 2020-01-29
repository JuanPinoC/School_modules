import React, { Component } from 'react';
import styles from './Styles.css';

import InputEditor from '../InputEditor/InputEditor';
import ActionButtons from '../ActionButtons/ActionButtons';

class sectionEditor extends Component {

	constructor (props) {
		super(props);

		const data = props.data;

		const inputTypes = [
			{
				value: 'Number',
				label: 'Númerica',
				config: {
						showWeight: true,
						showOptions: false,
						showMaxValue: true,
						showMinValue: true
				}
			},
			{
				value: 'Text',
				label: 'Textual',
				config: {
						showWeight: false,
						showOptions: false,
						showMaxValue: true,
						showMinValue: true
				}
			},
			{
				value: 'Number Options',
				label: 'Opción Múltiple Númerica',
				config: {
						showWeight: true,
						showOptions: true,
						showMaxValue: false,
						showMinValue: false
				}
			},
			{
				value: 'Text Options',
				label: 'Opción Múltiple Textual',
				config: {
						showWeight: false,
						showOptions: true,
						showMaxValue: false,
						showMinValue: false
				}
			}
		];

		this.state = {
			name: data.name || '',
			weight: data.weight || 0,
			type: data.type || 'sum',
			inputsData: data.inputs || [],
			inputViews: [],
			inputTypes: inputTypes
		};

		this.moveInput = this.moveInput.bind(this);
		this.deleteInput = this.deleteInput.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	componentDidMount () {

		let inputsData = this.state.inputsData;

		inputsData.forEach( (e) => {
			this.addInput( e );			
		});

	}

	addInput = ( data = null ) => {

		const key = 'i' + Math.round(Math.random() * 1000);

		this.setState( (state, props) => ({ 
			inputViews: [	...state.inputViews, 
							(<InputEditor id={ key } key={ key } data={ data } parent={ this.props.id }
								inputTypes={ this.state.inputTypes } 
								move={ (action) => { this.moveInput(action, key) } } 
								delete={ () => { this.deleteInput( key ); } } />)	]
		}));

	}

	moveInput = ( action, key ) => {

		let inputViews = this.state.inputViews;

		const index = inputViews.findIndex( (e) => e.key === key );

		if(action === 'up' && index !== 0){
			const x = inputViews[ index - 1];
			const y = inputViews[ index ];

			inputViews[ index - 1 ] = y;
			inputViews[ index ] = x ;
		}
		else if( action === 'down' && index !== inputViews.length - 1 ){
			const x = inputViews[ index + 1];
			const y = inputViews[ index ];

			inputViews[ index + 1 ] = y;
			inputViews[ index ] = x ;
		}

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
			<div className={ styles.SectionEditorContainer }>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
				<div className={ styles.SectionEditorHeaders}>
					<div className={ styles.SectionEditorItem}>
						<label>Nombre de la sección: </label>
						<input className={ styles.SectionEditorName } type='text' value={ this.state.name } 
								onChange={ (e) => {this.onChangeHandler('name', e)} } />
					</div>
					<div className={ styles.SectionEditorItem}>
						<label>Peso: </label>
						<input className={ styles.SectionEditorWeight } type='number' value={ this.state.weight }
								onChange={ (e) => {this.onChangeHandler('weight', e)} } />
					</div>
					<div className={ styles.SectionEditorItem}>
						<label>Acción: </label>
						<select className={ styles.SectionEditorSelect } 
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

export default sectionEditor;