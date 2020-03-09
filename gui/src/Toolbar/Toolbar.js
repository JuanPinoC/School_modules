import React, { Component } from 'react';

import styles from './Styles.css';

import { Link } from "react-router-dom";

import { getUserType } from '../Functions/FormEditorFunctions';

class toolbar extends Component {

	constructor(props){

		super(props);

		this.state = {
			userType: '',
			loading: true
		};

	}

	componentDidMount(){

		let userTypePromise = new Promise( ( resolve, reject ) => { getUserType( resolve, reject); });
		userTypePromise.then( ( res ) => {

			this.setState({ 
				userType: res,
				loading: false
			});

		} ).catch( (err) => {

			this.setState({
				loading: false
			})

		});

	}

	render () {

		if( this.props.hidden || this.state.loading )
			return (<div></div>);

		let options = (<nav></nav>);

		switch(this.state.userType){
			case 'Administrador':
				options = (
							<nav>
								<ul>
									<li onClick={ this.props.closeToolbar }>
										<a>Cerrar</a>
									</li>
									
									<li>
										<Link className={ styles.Link } to='/records'>Registros</Link>
									</li>
									
									<li>
										<Link className={ styles.Link } to='/evaluationPlanList'>Lista de Planes de Evaluación</Link>
									</li>
									<li>
										<Link className={ styles.Link } to='/colorScaleList'>Lista de Escalas de Color</Link>
									</li>
									<li>
										<Link className={ styles.Link } to='/formList'>Lista de Formularios</Link>
									</li>

									<li>
										<Link className={ styles.Link } to='/userList'>Lista de Usuarios</Link>
									</li>
									<li>
										<Link className={ styles.Link } to='/userEvaluationList'>Evaluar Usuarios</Link>
									</li>
									<li>
										<Link className={ styles.Link } to='/performedEvaluations'>Evaluaciones Realizadas</Link>
									</li>
									<li>
										<Link className={ styles.Link } to='/performedEvaluationsAsEvaluated'>Evaluaciones como evaluado</Link>
									</li>

									<li>
										<Link className={ styles.Link } to='/UserProfile'>Mi Perfil</Link>
									</li>

									<li onClick={ this.props.onSignOut }>
										<a>Salir</a>
									</li>
								</ul>
							</nav>
						);
				break;
			case 'Evaluador':
				options = (
							<nav>
								<ul>
									<li onClick={ this.props.closeToolbar }>
										<a>Cerrar</a>
									</li>

									<li>
										<Link className={ styles.Link } to='/userEvaluationList'>Evaluar Usuarios</Link>
									</li>
									<li>
										<Link className={ styles.Link } to='/performedEvaluations'>Evaluaciones Realizadas</Link>
									</li>
									<li>
										<Link className={ styles.Link } to='/performedEvaluationsAsEvaluated'>Evaluaciones como evaluado</Link>
									</li>

									<li>
										<Link className={ styles.Link } to='/UserProfile'>Mi Perfil</Link>
									</li>

									<li onClick={ this.props.onSignOut }>
										<a>Salir</a>
									</li>
								</ul>
							</nav>
						);
				break;
			case 'Empleado':
				options = (
							<nav>
								<ul>
									<li onClick={ this.props.closeToolbar }>
										<a>Cerrar</a>
									</li>

									<li>
										<Link className={ styles.Link } to='/performedEvaluationsAsEvaluated'>Evaluaciones como evaluado</Link>
									</li>

									<li>
										<Link className={ styles.Link } to='/UserProfile'>Mi Perfil</Link>
									</li>

									<li onClick={ this.props.onSignOut }>
										<a>Salir</a>
									</li>
								</ul>
							</nav>
						);
				break;
			default:
				options = (
							<nav>
								<ul>
									<li onClick={ this.props.closeToolbar }>
										<a>Cerrar</a>
									</li>

									<li onClick={ this.props.onSignOut }>
										<a>Salir</a>
									</li>
								</ul>
							</nav>
						);
				break;

		}

		return ( this.props.hidden )? (<div></div>):(
				<div className={ styles.ToolbarContainer }>
					{ options }
				</div>
			);
	}

} export default toolbar;