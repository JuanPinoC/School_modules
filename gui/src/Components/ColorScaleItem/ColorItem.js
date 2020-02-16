import React, { Component } from 'react';
import styles from './Styles.css';

import Input from '../Input/Input';
import ActionButtons from '../ActionButtons/ActionButtons';

class formItem extends Component {

	constructor(props){
		
		super(props);

		const data = props.data;

		this.state = {
							label: data.label || '',
							max: data.max || 0,
							min: data.min || 0,
							color: data.color || ''
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	onChangeHandler = (fieldName, e) => {
		
		this.props.onFieldChangeHandler( this.props.id, fieldName, e.target.value );
		this.setState({ [fieldName]: e.target.value});

	}

	render(){

		return(
			<div className={ styles.ColorItemContainer }>
				<ActionButtons move={ this.props.move } delete={ this.props.delete } />
				<div className={ styles.FieldsGrid }>
					<Input label='Nombre' type='text' name='label' value={ this.state.label } onChange={ this.onChangeHandler } />
					<Input label='Color' type='color' name='color' value={ this.state.color } onChange={ this.onChangeHandler } />
					<Input label='Máx' type='number' name='max' value={ this.state.max } onChange={ this.onChangeHandler } />
					<Input label='Min' type='number' name='min' value={ this.state.min } onChange={ this.onChangeHandler } />
				</div>
			</div>
		);

	}

}

export default formItem;