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
								<Link className={ styles.Link } to='/formEditor'>Editor de Formularios</Link>
							</li>
							<li>
								<Link className={ styles.Link } to='/userForm'>Formulario de Usuarios</Link>
							</li>
							<li>
								<Link className={ styles.Link } to='/fillableForm'>Llenar evaluación</Link>
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