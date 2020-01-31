import React, { Component } from 'react';
import styles from './Styles.css';

class input extends Component {
	render() {
		return (
			<div className={ styles.InputContainer }>
				<input type={ this.props.type } className={ styles.Input } name={ this.props.name } placeholder={ this.props.label }
						onChange={ (e) => this.props.onChange( this.props.name, e )} value={ this.props.value } />
			</div>
		);
	}
}

export default input;