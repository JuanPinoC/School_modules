import React, { Component } from 'react';
import styles from './Styles.css';

import SubformEditor from '../SubformEditor/SubformEditor';

class formEditor extends Component {

	constructor (props) {
		super(props);

		const data = props.data;

		this.state = {
			name: data.name,
			weight: data.weight,
			type: data.type,
			subformsData: data.subforms,
			subformViews: []
		}

		this.deleteSubform = this.deleteSubform.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	componentDidMount () {

		let subformsData = this.state.subformsData;
		let subformViews = [];

		subformsData.forEach( (e) => {
			const key = 'i' + Math.round(Math.random() * 1000);
			subformViews.push(<SubformEditor key={ key } data={e} delete={ () => { this.deleteSubform( key ); } } />);			
		});

		this.setState({ subformViews: subformViews });

	}

	addSubform = () => {

		let subformViews = this.state.subformViews;

		const key = 'i' + Math.round(Math.random() * 1000);

		subformViews.push(<SubformEditor key={ key } data={ null } delete={ () => { this.deleteSubform( key ); } } />);

		this.setState({ subformViews: subformViews });

	}

	deleteSubform = ( key ) => {
		let subformViews = this.state.subformViews;

		const index = subformViews.findIndex( (e) => e.key === key );

		subformViews.splice(index, 1);

		this.setState({ subformViews: subformViews });
	}

	render () {

		const subformViews = this.state.subformViews || (<div>Vacío</div>); 

		return (
			<div className={ styles.FormEditorContainer }>
				<div className={ styles.FormEditorHeaders}>
					<div className={ styles.FormEditorItem}>
						<label>Nombre: </label>
						<input className={ styles.FormEditorName } type='text' value={ this.state.name } 
								onChange={ (e) => {this.onChangeHandler('name', e)} } />
					</div>
					<div className={ styles.FormEditorItem}>
						<label>Peso: </label>
						<input className={ styles.FormEditorWeight } type='number' value={ this.state.weight }
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
				</div>
				<div className={ styles.SubformsList }>
					{ subformViews }
				</div>
				<div className={ styles.AddSubformButton } onClick={ this.addSubform }>
					<h1 className={ styles.HorizontalAlign}>+</h1>
					<h3 className={ styles.HorizontalAlign}>Agregar Sección</h3>
				</div>
			</div>
		);
	}
}

export default formEditor;