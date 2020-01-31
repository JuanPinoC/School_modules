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

		let obj = {};

		obj.email = this.state.email;
		obj.password = this.state.password;

		const params = {
			method: 'post',
			url: 'user/create',
			data: obj,
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
			}
		};

		axios(params)
		.then( (res) => {
			console.log('Created');
		})
		.catch( (res) => {
			alert('Error');
		});
	}

	render() {
		return (
			<div className={ styles.LoginContainer }>
				<div className={ styles.Form }>
					<h2 className={ styles.Title }>Ingresar</h2>
					<Input type='email' label='E-mail' name='email' value={ this.state.email } onChange={ this.onChangeHandler } />
					<Input type='password' label='Contraseña' name='password' value={ this.state.password } onChange={ this.onChangeHandler } />
					<br/>
					<SubmitButton text='Ingresar' type='primary' />
				</div>
			</div>
		);
	}

}

export default loginContainer;
