import React, { Component } from 'react';
import styles from './Styles.css';

import Input from '../Input/Input';
import ActionButtons from '../ActionButtons/ActionButtons';

class formItem extends Component {

	constructor(props){
		
		super(props);

		const data = props.data;

		this.state = {
						form: data.form || '',
						weight: data.weight || 0,
						requiredAmount: data.requiredAmount || 0,

						formsData: this.props.formsData
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		
		this.props.onFieldChangeHandler( this.props.id, fieldName, e.target.value );
		this.setState({ [fieldName]: e.target.value});

	}

	render(){

		return(
			<div className={ styles.FormItemContainer }>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
				<div className={ styles.FieldsGrid }>
					<Input label='Formulario' type='select' name='form' 
							options={ this.state.formsData } value={ this.state.form } 
							onChange={ this.onChangeHandler } />

					<Input label='Peso(%)' type='number' name='weight' value={ this.state.weight } onChange={ this.onChangeHandler } />
			
					<Input label='Nro de veces' type='number' name='requiredAmount' value={ this.state.requiredAmount } onChange={ this.onChangeHandler } />
				</div>
			</div>
		);

	}

}

export default formItem;
