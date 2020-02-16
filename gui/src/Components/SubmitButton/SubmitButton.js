import React, { Component } from 'react';
import styles from './Styles.css';

class submitButton extends Component {

	constructor ( props ) {

		super( props );

		this.state = {
			buttonStyles: [ styles.ButtonContainer, (props.type === 'primary')? styles.primary : styles.secondary ].join(' ')
		}

	}

	render () {
		return (
				<div className={ this.state.buttonStyles } onClick={ this.props.onClick } >
					<h1 className={ styles.ButtonText }>{ this.props.text }</h1>
				</div>
			);
	}
}

export default submitButton;