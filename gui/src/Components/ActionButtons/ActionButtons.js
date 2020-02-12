import React, { Component } from 'react';
import styles from './Styles.css';

class actionButtons extends Component {

	render(){

		return(
			<div className={ styles.ActionButtonsContainer }>
				<div className={ [ styles.Button, styles.bgYellow ].join(' ') } onClick={ () => {this.props.move('up')} }>
					<img src={ require('../../img/arrowup.png') } alt="move up"/>
				</div>
				<div className={ [ styles.Button, styles.bgYellow ].join(' ') } onClick={ () => {this.props.move('down')} }>
					<img src={ require('../../img/arrowdown.png') } alt="move down"/>
				</div>
				<div className={ [ styles.Button, styles.bgRed ].join(' ') } onClick={ this.props.delete }>
					<img src={ require('../../img/cross.png') } alt="delete"/>
				</div>
			</div>
		);

	}

}

export default actionButtons;