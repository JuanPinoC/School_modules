import React, { Component } from 'react';
import styles from './Styles.css';

import axios from '../../Axios/Axios';

import { Redirect } from "react-router-dom";

import Input from '../Input/Input';
import SubmitButton from '../SubmitButton/SubmitButton';

import ColorItem from '../ColorScaleItem/ColorItem';

import { getToken, getUrlParams, getColorScale, moveElementInArray, randomNumber } from '../../Functions/FormEditorFunctions';

const EmptyColorItem = {
							label: '',
							max: 0,
							min: 0,
							color: ''
						};

class colorScaleForm extends Component {

	constructor (props) {

		super(props);

		this.state = {
			id: '',
			name: '',
			items: [],

			itemViews: [],

			disableSubmit: false,
			disableMoveItem: false,
			loading: true,
			redirect: ''
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);

		this.moveItem = this.moveItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.itemFieldChangeHandler = this.itemFieldChangeHandler.bind(this);

		this.onSubmitHandler = this.onSubmitHandler.bind(this);
	
	}

	componentDidMount(){

		const params = getUrlParams();

		if( params.id !== null && typeof params.id !== 'undefined' ){

			let colorScalePromise = new Promise( ( resolve, reject ) => { getColorScale( params.id, resolve, reject); });
			colorScalePromise.then( ( res ) => {
				
				this.setState({
					id: params.id,
					name: res.name,
					items: res.items,
					loading: false
				});

				let items = res.items;

				items.forEach( ( e ) => {
					this.addItem( e );
				});
				
			} );

		}else{
			this.setState({ loading: false });
		}

	}

	onChangeHandler = (field, e) => {
		this.setState({ [field]: e.target.value });
	}

	itemFieldChangeHandler = ( key, field, value ) => {

		let items = this.state.items;

		const index = items.findIndex( (e) => e.key === key || e._id === key || e.id === key );

		items[ index ] = { ...items[ index ], [field]: value };

		this.setState({ items: items });

	}

	addItem = ( data = null ) => {

		const key = data._id || 'f' + randomNumber();

		this.setState( (state, props) => ({
			itemViews: [	...state.itemViews,
							(<ColorItem id={ key } key={ key } data={ data } onFieldChangeHandler={ this.itemFieldChangeHandler } 
										move={ (action) => { this.moveItem(action, key) } } delete={ () => { this.deleteItem( key ) } } />)	]
		}));

		if( typeof data._id === 'undefined' ){

			this.setState({ items: [ ...this.state.items, { ...EmptyColorItem, key: key } ]  });

		}

	}

	moveItem = ( action, key ) => {

		if( !this.state.disableMoveItem ){

			this.setState({ disableMoveItem: true });

			const items = this.state.items;
			const itemViews = this.state.itemViews;

			this.setState({ 
							items: moveElementInArray( items, key, action ),
							itemViews: moveElementInArray( itemViews, key, action ),
							disableMoveItem: false
						});

		}

	}

	deleteItem = ( key ) => {

		let itemViews = this.state.itemViews;
		let items = this.state.items;

		const index = itemViews.findIndex( (e) => e.key === key || e._id === key || e.id === key );

		itemViews.splice(index, 1);
		items.splice(index, 1);

		this.setState({ itemViews: itemViews, items: items });

	}

	onSubmitHandler = () => {

		this.setState({ disableSubmit: true });

		const data = {
			id: this.state.id,
			name: this.state.name,
			items: this.state.items
		};

		const url = ( data.id === '' )? 'colorScale/create' : 'colorScale/update';

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
			alert('Escala de color guardada.');
			this.setState({ redirect: '/colorScaleList' });
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
								<h1 className={ styles.Title }>{ ( this.state.id !== '' )? 'Editar' : 'Crear' } Escala de Color</h1>
							</div>
							<div className={ styles.Form }>
								<div className={ styles.Grid5050 }>
									<Input type='text' label='Nombre' name='name' value={ this.state.name } 
											onChange={ this.onChangeHandler } />
								</div>

								<div className={ styles.FormsList }>
									<div className={ styles.SubtitleContainer }>
										<h3>Formularios</h3>
									</div>
									<div>
										{ this.state.itemViews }
									</div>
									<div className={ styles.AddItemButton } onClick={ this.addItem }>
										<h4>Agregar Item +</h4>
									</div>
								</div>

								<br/>
								<div className={ styles.ButtonContainer }>
									<SubmitButton text={ ( this.state.id !== '' )?'Guardar Cambios':'Crear Escala' } type='primary' 
													onClick={ this.onSubmitHandler } disabled={ this.state.disableSubmit } />
								</div>
							</div>
						</div>
					);

	}

}

export default colorScaleForm;
