import React, { Component } from 'react';
import styles from './Styles.css';

class input extends Component {
	render() {

		const options = this.props.options || [];

		const optionViews = options.map( (e) => (<option key={e._id} value={e._id}>{ e.name }</option>) );

		return ( this.props.type !== 'select' )?
		(
			<div className={ styles.InputContainer }>
				<input type={ this.props.type } className={ styles.Input } name={ this.props.name } placeholder={ this.props.label }
						onChange={ (e) => this.props.onChange( this.props.name, e )} value={ this.props.value } />
			</div>
		):
		(
			<div className={ styles.InputContainer }>
				<select className={ styles.Input } name={ this.props.name } value={ this.props.value } onChange={ (e) => this.props.onChange( this.props.name, e )}>
					<option>{this.props.label}</option>
					{ optionViews }
				</select>
			</div>
		)
		;
	}
}

export default input;