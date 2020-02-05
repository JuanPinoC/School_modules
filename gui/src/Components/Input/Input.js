import React, { Component } from 'react';
import styles from './Styles.css';

class input extends Component {
	render() {

		const options = this.props.options || [];
		const optionViews = options.map( (e) => (<option key={e._id} value={e._id}>{ e.name }</option>) );

		switch( this.props.type ){
			case 'select':
				
				return (
					<div className={ styles.InputContainer }>
						<select className={ styles.Input } name={ this.props.name } value={ this.props.value } 
								onChange={ (e) => this.props.onChange( this.props.name, e )}>
							<option>{this.props.label}</option>
							{ optionViews }
						</select>
					</div>
				);

				break;
			case 'textarea':
				
				return (
					<div className={ styles.InputContainer }>
						<textarea name={ this.props.name } rows="10" cols="50" placeholder={ this.props.label } 
							value={ this.props.value } onChange={ (e) => this.props.onChange( this.props.name, e )}>
						</textarea>
					</div>
				);

				break;
			default:

				return(
					<div className={ styles.InputContainer }>
						<input type={ this.props.type } className={ styles.Input } name={ this.props.name } placeholder={ this.props.label }
								value={ this.props.value } onChange={ (e) => this.props.onChange( this.props.name, e )}  />
					</div>
				);
					
				break;
		}

	}
}

export default input;