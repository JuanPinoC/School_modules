import React, { Component } from 'react';
import styles from './Styles.css';

class input extends Component {
	render() {

		const options = this.props.options || [];
		const optionViews = ( this.props.type == 'select' )?
							options.map( (e) => (<option key={e._id} value={e._id}>{ e.name }</option>) ) : 
							options.map( (e) => (
												<div>
													<input key={e._id} type="radio" name={ this.props.name } 
															value={e._id} onChange={ this.props.onChange( this.props.name, e._id ) }/>
													<label>{ e.name }</label>
												</div>
							) );

		switch( this.props.type ){
			case 'select':
				
				return (
					<div className={ styles.InputContainer }>
						<select className={ styles.Input } name={ this.props.name } value={ this.props.value } 
								onChange={ (e) => this.props.onChange( this.props.name, e )}>
							<option className={ styles.SelectOption }>{this.props.label}</option>
							{ optionViews }
						</select>
					</div>
				);

				break;
			case 'textarea':
				
				return (
					<div className={ styles.InputContainer }>
						<textarea name={ this.props.name } rows="10" cols="50" placeholder={ this.props.label } 
							value={ this.props.value } onChange={ (e) => this.props.onChange( this.props.name, e )}
							maxLength={ this.props.max } minLength={ this.props.min }>
						</textarea>
					</div>
				);

				break;
			case 'radiobuttons':
				return(
					<div className={ styles.InputContainer }>
						<label>{ this.props.label }</label>
						<div className={ styles.RadioButtonsContainer}>
							{ optionViews }
						</div>
					</div>
				);
				break;
			case 'checkbox':
				return(
					<div className={ styles.InputContainer }>
						<label>{ this.props.label }</label>
						<input type='checkbox' value={ this.props.value } 
							onChange={ (e) => { this.onChangeHandler(this.props.name, { target: { value: e.target.checked } } )} } />
					</div>
				);	
				break;
			default:

				return(
					<div className={ styles.InputContainer }>
						<input type={ this.props.type } className={ styles.Input } name={ this.props.name } placeholder={ this.props.label }
								value={ this.props.value } onChange={ (e) => this.props.onChange( this.props.name, e )}
								min={ this.props.min } max={ this.props.max }  />
					</div>
				);
					
				break;
		}

	}
}

export default input;