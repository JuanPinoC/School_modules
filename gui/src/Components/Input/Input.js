import React, { Component } from 'react';
import styles from './Styles.css';


const OptionCheckedStyles = {
			Container: [ styles.RadioButtonContainer, styles.RadioButtonContainerChecked ].join(' '),
			Label: [ styles.RadioButtonLabel, styles.RadioButtonLabelChecked ].join(' '),
			Button: [ styles.RadioButton, styles.RadioButtonChecked ].join(' ')
		};

class input extends Component {

	constructor(props){
		
		super(props);
		
		this.state = {
			name: this.props.name,
			value: '',
			LabelDinamicStyles: styles.FloatingLabel
		};

	}

	onOptionSelected = ( value ) => {
		this.props.onChange( this.state.name, { target: { value: value } } );
		this.setState({ value: value });
	}

	componentDidMount = () => {
		this.onBlur();
	}

	onFocus = () => {
		this.setState({ LabelDinamicStyles: [ styles.FloatingLabel, styles.FloatingLabelInputFocus ].join(' ')  });
	}

	onBlur = () => {
		if( this.props.type === 'text' || 'textarea' && this.props.value === '' ){
			this.setState({ LabelDinamicStyles: [ styles.FloatingLabel, styles.FloatingLabelInputBlur ].join(' ')  });
			return;
		}else if(this.props.type === 'number' && this.props.value >= 0 || this.props.value <= 0 ){
			this.setState({ LabelDinamicStyles: [ styles.FloatingLabel, styles.FloatingLabelInputFocus ].join(' ')  });
			return;
		}
	}

	render() {

		const options = this.props.options || [];
		const optionViews = ( this.props.type == 'select' )?
							options.map( (e) => (<option className={ styles.SelectOption } key={e._id} value={e._id}>{ e.name }</option>) ) : 
							options.map( (e) => {

								const checked = this.state.value === e._id;

								return (
										<div key={e._id} 
												className={ ( checked )? OptionCheckedStyles.Container : styles.RadioButtonContainer } 
												onClick={ () => this.onOptionSelected( e._id ) }>
											<div className={ ( checked )? OptionCheckedStyles.Button : styles.RadioButton } ></div>
											<label className={ ( checked )? OptionCheckedStyles.Label : styles.RadioButtonLabel }>{ e.label }</label>
										</div>
								);
							});

		switch( this.props.type ){
			case 'select':
				
				return (
					<div className={ styles.InputContainer }>
						<select className={ styles.InputSelect } name={ this.props.name } value={ this.props.value } 
								onChange={ (e) => this.props.onChange( this.props.name, e )}>
							{ optionViews }
						</select>
						<span className={ [ styles.FloatingLabel, styles.FloatingLabelInputFocus ].join(' ') } >{ this.props.label }</span>
					</div>
				);

				break;
			case 'textarea':
				
				return (
					<div className={ styles.InputContainer }>
						<textarea className={ styles.TextArea } name={ this.props.name } rows="10" cols="50"
							value={ this.props.value } onChange={ (e) => this.props.onChange( this.props.name, e )}
							maxLength={ this.props.max } minLength={ this.props.min }
							onFocus={ this.onFocus }
							onBlur={ this.onBlur }>
						</textarea>
						<span className={ this.state.LabelDinamicStyles } >{ this.props.label }</span>
					</div>
				);

				break;
			case 'radiobuttons':
				return(
					<div className={ styles.InputContainer }>
						<label className={ styles.RadioButtonGroupLabel }>{ this.props.label }</label>
						<div className={ styles.RadioButtonGroupContainer}>
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
						<input className={ styles.Input } type={ this.props.type } name={ this.props.name } value={ this.props.value }
								max={ this.props.max } min={ this.props.min }
								onChange={ (e) => this.props.onChange( this.props.name, e ) }
								onFocus={ this.onFocus }
								onBlur={ this.onBlur } />
						<span className={ this.state.LabelDinamicStyles } >{ this.props.label }</span>
					</div>
				);
					
				break;
		}

	}
}

export default input;