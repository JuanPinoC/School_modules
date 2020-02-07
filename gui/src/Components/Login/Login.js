import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';


class loginContainer extends Component {

	constructor (props) {

		super(props);
		this.state = {
			email: '',
			password: ''
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onSubmitHandler = this.onSubmitHandler.bind(this);

	}

	onChangeHandler = (field, e) => {
		this.setState({ [field]: e.target.value });
	}

	onSubmitHandler = () => {

		const data = {
			email: this.state.email,
			password: this.state.password
		};

		const params = {
			method: 'post',
			url: 'user/login',
			data: data,
			headers: {
				'Content-Type': 'application/json'
			}
		};
			
		axios(params)
		.then( (res) => {
			this.props.onSignIn( res.data );
		})
		.catch( (res) => {
			alert('Usuario o contraseña incorrectos.');
		});
	}

	render() {
		return (
			<div className={ styles.LoginContainer }>
				<div className={ styles.Form }>
					<h2 className={ styles.Title }>Inicio de Sesión</h2>
					<Input type='email' label='E-mail' name='email' value={ this.state.email } onChange={ this.onChangeHandler } />
					<Input type='password' label='Contraseña' name='password' value={ this.state.password } onChange={ this.onChangeHandler } />
					<br/>
					<div className={ styles.ButtonContainer }>
						<SubmitButton text='Ingresar' type='primary' onClick={ this.onSubmitHandler } />
					</div>
				</div>
			</div>
		);
	}

}

export default loginContainer;
