import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { Redirect } from "react-router-dom";

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

import { getToken, getUrlParams, getUser, getUserTypes, randomNumber } from '../../Functions/FormEditorFunctions';


class userForm extends Component {

	constructor (props) {

		super(props);

		this.state = {
			id: '',
			name: '',
			type: '',
			email: '',
			password: '',

			userTypes: [],

			disableSubmit: false,
			loading: true,
			redirect: ''
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onSubmitHandler = this.onSubmitHandler.bind(this);
	
	}

	componentDidMount(){

		let userTypesPromise = new Promise( ( resolve, reject ) => { getUserTypes(resolve, reject); });
		userTypesPromise.then( 
			( res ) => {
							this.setState({ userTypes: res, type: ( this.state.type === '' )? res[0]._id : this.state.type });
			} );

		const params = getUrlParams();

		if( params.id !== null && typeof params.id !== 'undefined' ){

			let userPromise = new Promise( ( resolve, reject ) => { getUser( params.id, resolve, reject); });
			userPromise.then( ( res ) => {
				
				this.setState({
					id: params.id,
					name: res.name,
					type: res.type._id,
					email: res.email,
					loading: false
				});
				
			} );

		}else{
			this.setState({ loading: false });
		}

	}

	onChangeHandler = (field, e) => {
		this.setState({ [field]: e.target.value });
	}

	onSubmitHandler = () => {

		this.setState({ disableSubmit: true });

		const data = {
			id: this.state.id,
			name: this.state.name,
			type: this.state.type,
			email: this.state.email,
			password: this.state.password
		};

		const url = ( data.id === '' )? 'user/create' : 'user/update';

		const params = {
			method: 'post',
			url: url,
			data: data,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + getToken()
			}
		};
		
		axios(params)
		.then( (res) => {
			alert('Usuario guardado.');
			this.setState({ redirect: '/userList' });
		})
		.catch( (res) => {
			alert('Error al guardar. Intente de nuevo.');
			this.setState({ disableSubmit: false });
		});
		
	}

	render() {

		if( this.state.redirect !== '' )
			return ( <Redirect to={this.state.redirect} /> );

		return ( this.state.loading )?
					(
						<div className={ styles.FormContainer }>
							<h1>Loading</h1>
						</div>
					):(
						<div className={ styles.FormContainer }>
							<div className={ styles.TitleContainer }>
								<h1 className={ styles.Title }>{ ( this.state.id !== '' )? 'Editar' : 'Crear' } Usuario</h1>
							</div>
							<div className={ styles.Form }>

								<div className={ styles.Grid5050 }>
									<Input type='text' label='Nombre' name='name' value={ this.state.name } 
											onChange={ this.onChangeHandler } />
									<Input type='select' label='Tipo' name='type' value={ this.state.type } 
											options={ this.state.userTypes } onChange={ this.onChangeHandler } />
									<Input type='email' label='E-mail' name='email' value={ this.state.email } 
											onChange={ this.onChangeHandler } />
									<Input type='password' label=' Nueva contraseña' name='password' value={ this.state.password } 
											onChange={ this.onChangeHandler } />
								</div>

								<br/>
								<div className={ styles.ButtonContainer }>
									<SubmitButton text={ ( this.state.id !== '' )?'Guardar Cambios':'Crear Usuario' } type='primary' 
													onClick={ this.onSubmitHandler } disabled={ this.state.disableSubmit } />
								</div>
							</div>
						</div>
					);

	}

}

export default userForm;
