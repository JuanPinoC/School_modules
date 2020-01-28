import React, { Component } from 'react';
import styles from './Styles.css';

import OptionEditor from '../OptionEditor/OptionEditor';
import ActionButtons from '../ActionButtons/ActionButtons';

class inputEditor extends Component {

	constructor(props){
		super(props);

		const data = props.data;

		this.state = {
			label:	(data != null )? data.label : '',
			type:	(data != null )? data.type : 'Number',
			weight: (data != null )? data.weight : 0,
			optionsData: (data != null )? data.options : [],
			optionViews: [],
			maxValue: (data != null )? data.maxValue : 0,
			minValue: (data != null )? data.minValue : 0,
			showItemsConfig: this.getShowItemsConfig( (data != null )? data.type : 'Number' )
		};

		this.moveOption = this.moveOption.bind(this);
		this.deleteOption = this.deleteOption.bind(this);
	}

	onChangeHandler = (fieldName, e) => {

		this.setState({ [fieldName]: e.target.value});

		if ( fieldName === 'type') {
			this.setState({ showItemsConfig: this.getShowItemsConfig( e.target.value ) });
		}
	}

	getShowItemsConfig = ( value ) => {

		const inputTypes = this.props.inputTypes;
		const element = inputTypes.find( e => e.value === value );
		return element.config;

	}

	componentDidMount () {

		let optionsData = this.state.optionsData;

		optionsData.forEach( (e) => {
			this.addOption( e );
		});
		
	}

	addOption = ( data = null ) => {

		const key = 'o' + Math.round(Math.random() * 1000);

		this.setState( (state, props) => ({ 
			optionViews: [	...state.optionViews, 
							(<OptionEditor id={ key } key={ key } data={ data } parent={ this.id }
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

		const inputTypes = this.props.inputTypes;
		const inputType = this.state.type;
		const optionViews = this.state.optionViews;
		const showItemsConfig = this.state.showItemsConfig;

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
								onChange={ (e) => {this.onChangeHandler('type', e)} }
								value={ inputType }>
							{
								inputTypes.map( ( e ) => {
									return ( <option value={ e.value } >{ e.label }</option> )
								})
							}
						</select>
					</div>
					
					{	( showItemsConfig.showWeight )?(
						<div className={ styles.InputEditorItem}>
							<label>Peso: </label>
							<input className={ styles.InputEditorWeight } type='number' value={ this.state.weight }
									onChange={ (e) => {this.onChangeHandler('weight', e)} } />
						</div>
						):('')	}
					
					{	( showItemsConfig.showMaxValue )?(
						<div className={ styles.InputEditorItem }>
							<label>Max: </label>
							<input className={ styles.InputEditorLimit } type='number' value={ this.state.maxValue }
									onChange={ (e) => {this.onChangeHandler('maxValue', e)} } />
						</div>
						):('')	}

					{	( showItemsConfig.showMinValue )?(
						<div className={ styles.InputEditorItem}>
							<label>Min: </label>
							<input className={ styles.InputEditorLimit } type='number' value={ this.state.minValue }
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

export default inputEditor;