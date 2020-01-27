import React, { Component } from 'react';
import styles from './Styles.css';

class actionButtons extends Component {

	render(){

		return(
			<div className={ styles.ActionButtons }>
				<div className={ styles.MoveUpButton } onClick={ () => {this.props.move('up')} }>^</div>
				<div className={ styles.MoveDownButton } onClick={ () => {this.props.move('down')} }>v</div>
				<div className={ styles.removeItemButton } onClick={ this.props.delete }>X</div>
			</div>
		);

	}

}

export default actionButtons;