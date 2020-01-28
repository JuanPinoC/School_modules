import React, { Component } from 'react';
import styles from './Styles.css';

import SectionEditor from '../SectionEditor/SectionEditor';

class formEditor extends Component {

	constructor (props) {
		super(props);

		const data = props.data;

		this.state = {
			name: data.name,
			weight: data.weight,
			type: data.type,
			sectionsData: data.sections,
			sectionViews: []
		}
		this.moveSection = this.moveSection.bind(this);
		this.deleteSection = this.deleteSection.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	componentDidMount () {

		let sectionsData = this.state.sectionsData;

		sectionsData.forEach( (e) => {
			this.addSection( e );
		});

	}

	addSection = ( data = null ) => {

		const key = 'i' + Math.round(Math.random() * 1000);

		this.setState( (state, props) => ({ 
			sectionViews: [	...state.sectionViews, 
							(<SectionEditor key={ key } data={ data } 
								move={ (action) => { this.moveSection(action, key) } } 
								delete={ () => { this.deleteSection( key ); } } />)	]
		}));

	}

	moveSection = ( action, key ) => {

		let sectionViews = this.state.sectionViews;

		const index = sectionViews.findIndex( (e) => e.key === key );

		if(action === 'up' && index !== 0){
			const x = sectionViews[ index - 1];
			const y = sectionViews[ index ];

			sectionViews[ index - 1 ] = y;
			sectionViews[ index ] = x ;
		}
		else if( action === 'down' && index !== sectionViews.length - 1 ){
			const x = sectionViews[ index + 1];
			const y = sectionViews[ index ];

			sectionViews[ index + 1 ] = y;
			sectionViews[ index ] = x ;
		}

		this.setState({ sectionViews: sectionViews });

	}

	deleteSection = ( key ) => {
		let sectionViews = this.state.sectionViews;

		const index = sectionViews.findIndex( (e) => e.key === key );

		sectionViews.splice(index, 1);

		this.setState({ sectionViews: sectionViews });
	}

	render () {

		const sectionViews = this.state.sectionViews || (<div>Vacío</div>); 

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
				<div className={ styles.SectionsList }>
					{ sectionViews }
				</div>
				<div className={ styles.AddSectionButton } onClick={ this.addSection }>
					<h1 className={ styles.HorizontalAlign}>+</h1>
					<h3 className={ styles.HorizontalAlign}>Agregar Sección</h3>
				</div>
			</div>
		);
	}
}

export default formEditor;