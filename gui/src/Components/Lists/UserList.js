import React, { Component } from 'react';
import styles from './Styles.css';

import RecordsTable from '../RecordsTable/RecordsTable';

import { getUsers, removeUser } from '../../Functions/FormEditorFunctions';

class userList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Usuarios',

			createRoute: '/userForm',
			updateRoute: '/userForm?id=',

			headers: [
						{ name: '_id', label: 'ID' }, 
						{ name: 'name', label: 'Nombre' },
						{ name: 'email', label: 'E-mail' },
						{ name: 'type', label: 'Tipo' }
					],
			subheaders: [ { name: 'type', fields: ['name'] } ],

			records: []
		};

	}

	componentDidMount () {

		let getRecordsPromise = new Promise( ( resolve, reject ) => { getUsers(resolve, reject); });
			getRecordsPromise.then( ( res ) => { this.setState({ records: res }); } );

	}

	deleteFunction = ( id ) => {

		let removeRecordsPromise = new Promise( ( resolve, reject ) => { removeUser(id, resolve, reject); });
			removeRecordsPromise.then( ( res ) => { alert('Usuario eliminado.') } );

	}

	render() {
		return (
			<div className={ styles.ListContainer }>
				{	
					( this.state.records.length > 0 )? 
						(<RecordsTable	title={ this.state.title }
										headers={ this.state.headers } subheaders={ this.state.subheaders } records={ this.state.records }
										createRoute={ this.state.createRoute } updateRoute={ this.state.updateRoute } delete={ this.deleteFunction } />)
						:(<div>No hay registros para mostrar.</div>)
				}
			</div>
		);
	}

}

export default userList;