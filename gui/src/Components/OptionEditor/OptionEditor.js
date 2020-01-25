import React, { Component } from 'react';
import styles from './Styles.css';

class optionEditor extends Component {

	constructor(props){
		super(props);

		const data = props.data;

		this.state = {
			label:	data.label,
			value: data.value
		}
	}

	onChangeHandler = (fieldName, e) => {
		this.setState({ [fieldName]: e.target.value});
	}

	render(){

		return(
			<div className={ styles.OptionEditorContainer }>
				<input className={ styles.OptionEditorLabel } type='text' value={ this.state.label }
							onChange={ (e) => {this.onChangeHandler('label', e)} } />
				<input className={ styles.OptionEditorValue } type={(this.state.value >= 0)? 'number':'text' } value={ this.state.value }
							onChange={ (e) => {this.onChangeHandler('value', e)} } />			
			</div>
		);

	}

}

export default optionEditor;
