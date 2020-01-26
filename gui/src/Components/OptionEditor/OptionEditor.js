import React, { Component } from 'react';
import styles from './Styles.css';

class optionEditor extends Component {

	constructor(props){
		super(props);

		const data = props.data;

		this.state = ( data != null )?
		{
			label:	data.label,
			value: data.value
		}:{
			label:	'',
			value: 0
		}
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
				<div className={ styles.ActionButtons }>
					<div className={ styles.MoveUpButton } onClick={ () => {this.props.move('up')} }>^</div>
					<div className={ styles.MoveDownButton } onClick={ () => {this.props.move('down')} }>v</div>
					<div className={ styles.removeItemButton } onClick={ this.props.delete }>X</div>
				</div>
			</div>
		);

	}

}

export default optionEditor;
