import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

class loginContainer extends Component {

	constructor (props) {

		super(props);

		this.state = {
			name: '',
			type: '',
			email: '',
			password: '',
			confirmPassword: '',
			userTypes: []
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onSubmitHandler = this.onSubmitHandler.bind(this);

	}

	onChangeHandler = (field, e) => {
		this.setState({ [field]: e.target.value });
	}

	componentDidMount(){
		this.getUserTypes();
	}

	getUserTypes = () => {
		
		axios.get(
					'userType/',
					{ headers: { 'Authorization': 'Bearer' + sessionStorage.getItem('jwtToken') }} 
			)
			.then( ( res ) => {

				this.setState({ userTypes: res.data.records });

			})
			.catch( (res) => {
				console.log(res);
			});

	}

	onSubmitHandler = () => {

		let obj = {
			name: this.state.name,
			type: this.state.type,
			email: this.state.email,
			password: this.state.password
		};

		const params = {
			method: 'post',
			url: 'user/create',
			data: obj,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
			}
		};
			
		axios(params)
		.then( (res) => {
			console.log('Created');
		})
		.catch( (res) => {
			console.log(res);
		});
	}

	render() {
		return (
			<div className={ styles.LoginContainer }>
				<div className={ styles.Form }>
					<h2 className={ styles.Title }>Crear Usuario</h2>
					<Input type='text' label='Nombre' name='name' value={ this.state.name } onChange={ this.onChangeHandler } />
					<Input type='email' label='E-mail' name='email' value={ this.state.email } onChange={ this.onChangeHandler } />
					<Input type='password' label='Contraseña' name='password' value={ this.state.password } onChange={ this.onChangeHandler } />
					<Input type='password' label='Confirmar contraseña' name='confirmPassword' value={ this.state.confirmPassword } onChange={ this.onChangeHandler } />
					<Input type='select' label='Tipo de usuario' name='type' value={ this.state.type } options={ this.state.userTypes } onChange={ this.onChangeHandler } />
					<br/>
					<div className={ styles.ButtonContainer }>
						<SubmitButton text='Crear' type='primary' onClick={ this.onSubmitHandler } />
					</div>
				</div>
			</div>
		);
	}

}

export default loginContainer;
