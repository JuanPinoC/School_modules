import React, { Component } from 'react';
import styles from './Styles.css';

import Input from '../Input/Input';
import ActionButtons from '../ActionButtons/ActionButtons';

class optionEditor extends Component {

	constructor(props){
		
		super(props);

		const data = props.data;

		this.state = {
			label: data.label || '',
			numberValue: data.numberValue || 0,
			stringValue: data.stringValue || ''
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		
		this.setState({ [fieldName]: e.target.value});
		this.props.onFieldChangeHandler( this.props.id, fieldName, e.target.value );

	}

	render(){

		return(
			<div className={ styles.OptionEditorContainer }>
				<div className={ styles.OptionEditorItem }>				
					<Input label='Nombre' type='text' name='label' value={ this.state.label } onChange={ this.onChangeHandler } />
				</div>
				<div className={ styles.OptionEditorItem }>
					
					{
						( true )?
							(
								<Input label='Valor' type='number' name='numberValue' value={ this.state.numberValue } onChange={ this.onChangeHandler } />
							):
							(
								<Input label='Valor' type='text' name='stringValue' value={ this.state.stringValue } onChange={ this.onChangeHandler } />
							)
					}
					
				</div>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
			</div>
		);

	}

}

export default optionEditor;
