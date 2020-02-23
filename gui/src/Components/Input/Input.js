import React, { Component } from 'react';
import styles from './Styles.css';


const OptionCheckedStyles = {
			Container: [ styles.RadioButtonContainer, styles.RadioButtonContainerChecked ].join(' '),
			Label: [ styles.RadioButtonLabel, styles.RadioButtonLabelChecked ].join(' '),
			Button: [ styles.RadioButton, styles.RadioButtonChecked ].join(' ')
		};

const CheckBtnCheckedStyles = {
			Container: [ styles.RadioButtonContainer, styles.RadioButtonContainerChecked ].join(' '),
			Label: [ styles.RadioButtonLabel, styles.RadioButtonLabelChecked ].join(' '),
			Button: [ styles.CheckButton, styles.CheckButtonChecked ].join(' ')
		};

const DinamicLabelStyles = {
			OnWhiteFocus: [ styles.FloatingLabel, styles.FloatingLabelInputFocus, styles.whiteFont ].join(' '),
			Focus: [ styles.FloatingLabel, styles.FloatingLabelInputFocus ].join(' '),
			Blur: [ styles.FloatingLabel, styles.FloatingLabelInputBlur ].join(' ')
};


class input extends Component {

	constructor(props){
		
		super(props);
		
		this.state = {
			name: this.props.name,
			value: '',
			booleanValue: this.props.value,
			labelStyle: styles.FloatingLabel
		};

	}

	componentDidMount = () => {

		if(this.props.type === 'radiobuttons' && this.props.value !== ''){
			this.setState({ value: this.props.value });
		}

		if( this.props.type === 'select' && this.props.value === ''){

			const options = this.props.options || [];
			
			if( options.length > 0)
				this.props.onChange( this.props.name, { target: { value: options[0]._id } } );
		}

		if( this.props.type === 'color' && this.props.value === ''){
				this.props.onChange( this.props.name, { target: { value: '#000000' } } );
		}

		this.onFocus();
		this.onBlur();

	}

	onFocus = () => {
		this.setState({ labelStyle: ( this.props.color === 'white' )? DinamicLabelStyles.OnWhiteFocus : DinamicLabelStyles.Focus });
	}

	onBlur = () => {

		if( ( this.props.type === 'text' || 'textarea' || 'email' || 'password') && this.props.value === '' ){
			this.setState({ labelStyle: DinamicLabelStyles.Blur  });
			return;
		}else if(this.props.type === 'number' && ( this.props.value >= 0 || this.props.value <= 0 ) ){
			this.onFocus();
			return;
		}
	}

	onOptionSelected = ( value ) => {
		if( !this.props.disabled ){
			this.props.onChange( this.state.name, { target: { value: value } } );
			this.setState({ value: value });			
		}
	}

	onCheckBoxChange = () => {

		this.props.onChange( this.state.name, { target: { value: !this.state.booleanValue } } );
		this.setState({ booleanValue: !this.state.booleanValue });

	}

	render() {

		const options = this.props.options || [];

		const optionViews = ( this.props.type === 'select' )?
							options.map( (e) => (<option className={ styles.SelectOption } key={e._id} value={e._id}>{ e.name }</option>) ) : 
							options.map( (e) => {

								const checked = this.state.value + '' === e._id + '';

								return (
										<div key={e._id} 
												className={ ( checked )? OptionCheckedStyles.Container : styles.RadioButtonContainer } 
												onClick={ () => this.onOptionSelected( e._id ) }>
											<div className={ ( checked )? OptionCheckedStyles.Button : styles.RadioButton } >
												<img src={ require('../../img/checkmark.png') } alt="check mark"/>
											</div>
											<label className={ ( checked )? OptionCheckedStyles.Label : styles.RadioButtonLabel }>{ e.label }</label>
										</div>
								);
							});

		switch( this.props.type ){
			case 'select':	
				return (
					<div className={ styles.InputContainer }>
						<select className={ styles.InputSelect } name={ this.props.name } 
								value={ this.props.value } 
								onChange={ (e) => this.props.onChange( this.props.name, e ) }>
							{ optionViews }
						</select>
						<span className={ ( this.props.color === 'white' )? DinamicLabelStyles.OnWhiteFocus : DinamicLabelStyles.Focus } >
							{ this.props.label }
						</span>
					</div>
				);


			case 'radiobuttons':
				return(
					<div className={ styles.InputContainer }>
						<label className={ styles.RadioButtonGroupLabel }>{ this.props.label }</label>
						<div className={ styles.RadioButtonGroupContainer}>
							{ optionViews }
						</div>
					</div>
				);


			case 'checkbox':
				return(
					<div className={ styles.InputContainer } onClick={ this.onCheckBoxChange }>
						<label className={ styles.CheckButtonLabel }>
							{ this.props.label }
						</label>
						<div className={ ( this.state.booleanValue === true )? CheckBtnCheckedStyles.Button : styles.CheckButton }>
							<img src={ require('../../img/checkmark.png') } alt="check mark"/>
						</div>
					</div>
				);	


			case 'textarea':
				return (
					<div className={ styles.InputContainer }>
						<textarea className={ styles.TextArea } name={ this.props.name } rows="10" cols="50"
							value={ this.props.value } onChange={ (e) => this.props.onChange( this.props.name, e )}
							maxLength={ this.props.max } minLength={ this.props.min }
							onFocus={ this.onFocus }
							onBlur={ this.onBlur }
							disabled={( this.props.disabled )? 'disabled' : '' }>
						</textarea>
						<span className={ this.state.labelStyle } >{ this.props.label }</span>
					</div>
				);


			case 'date':
				return(
					<div className={ styles.InputContainer }>
						<input className={ styles.Input } type={ this.props.type } name={ this.props.name } value={ this.props.value }
								max={ this.props.max } min={ this.props.min }
								onChange={ (e) => this.props.onChange( this.props.name, e ) }
								onFocus={ this.onFocus }
								onBlur={ this.onBlur } />
						<span className={ ( this.props.color === 'white' )? DinamicLabelStyles.OnWhiteFocus : DinamicLabelStyles.Focus }>
							{ this.props.label }
						</span>
					</div>
				);
			
			case 'color':
				return(
					<div className={ styles.InputContainer }>
						<input className={ styles.Input } type={ this.props.type } name={ this.props.name } value={ this.props.value }
								max={ this.props.max } min={ this.props.min }
								onChange={ (e) => this.props.onChange( this.props.name, e ) }
								onFocus={ this.onFocus }
								onBlur={ this.onBlur } />
						<span className={ ( this.props.color === 'white' )? DinamicLabelStyles.OnWhiteFocus : DinamicLabelStyles.Focus } >
							{ this.props.label }
						</span>
					</div>
				);

			default:
				return(
					<div className={ styles.InputContainer }>
						<input className={ styles.Input } type={ this.props.type } name={ this.props.name } value={ this.props.value }
								max={ this.props.max } min={ this.props.min }
								onChange={ (e) => this.props.onChange( this.props.name, e ) }
								onFocus={ this.onFocus }
								onBlur={ this.onBlur } 
								disabled={( this.props.disabled )? 'disabled' : '' } />
						<span className={ this.state.labelStyle } >{ this.props.label }</span>
					</div>
				);

		}

	}
}

export default input;