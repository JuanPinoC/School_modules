import React, { Component } from 'react';
import styles from './Styles.css';

class submitButton extends Component {
	render () {
		return (this.props.type === 'primary')?
			(
				<div className={ [ styles.ButtonContainer, styles.primary ].join(' ') }
						onClick={ this.props.onClick }>
					<h3 className={ styles.ButtonText }>{ this.props.text }</h3>
				</div>
			):(
				<div className={ [ styles.ButtonContainer, styles.secondary ].join(' ') }
						onClick={ this.props.onClick }>
					<h4 className={ styles.ButtonText }>{ this.props.text }</h4>
				</div>
			)
	}
}

export default submitButton;