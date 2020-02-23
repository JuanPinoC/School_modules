import React, { Component } from 'react';

import styles from './Styles.css';

import { Link } from "react-router-dom";

class toolbar extends Component {

	render () {
		return ( this.props.hidden )? (<div></div>):(
				<div className={ styles.ToolbarContainer }>
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

							<li onClick={ this.props.onSignOut }>
								<a>Salir</a>
							</li>
						</ul>
					</nav>
				</div>
			);
	}

} export default toolbar;