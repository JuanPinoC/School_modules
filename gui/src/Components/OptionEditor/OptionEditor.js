import React, { Component } from 'react';
import styles from './Styles.css';

import ActionButtons from '../ActionButtons/ActionButtons';

class optionEditor extends Component {

	constructor(props){
		super(props);

		const data = props.data;

		this.state = {
			label: ( data != null )? data.label : '',
			value: ( data != null )? data.value : 0
		};
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	render(){

		return(
			<div className={ styles.OptionEditorContainer }>
				<div className={ styles.OptionEditorItem }>				
					<label>Nombre: </label>
					<input className={ styles.OptionEditorLabel } type='text' value={ this.state.label }
							onChange={ (e) => {this.onChangeHandler('label', e)} } />
				</div>
				<div className={ styles.OptionEditorItem }>
					<label>Valor: </label>
					<input className={ styles.OptionEditorValue } type={(this.state.value >= 0)? 'number':'text' } value={ this.state.value }
							onChange={ (e) => {this.onChangeHandler('value', e)} } />
				</div>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
			</div>
		);

	}

}

export default optionEditor;
