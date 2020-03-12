import React, { Component } from 'react';
import styles from './Styles.css';

import RecordsTable from '../RecordsTable/RecordsTable';

import { getForms, removeForm } from '../../Functions/FormEditorFunctions';

class formList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Formularios',

			createRoute: '/formEditor',
			updateRoute: '/formEditor?id=',

			headers: [
						{ name: '_id', label: 'ID' }, 
						{ name: 'name', label: 'Nombre' },
						{ name: 'type', label: 'Tipo' },
						{ name: 'colorScale', label: 'Escala de Color' },
					],
			subheaders: [ { name: 'colorScale', fields: ['name'] }  ],

			records: [],

			loading: true
		};

	}

	componentDidMount () {

		let getRecordsPromise = new Promise( ( resolve, reject ) => { getForms(resolve, reject); });
			getRecordsPromise.then( ( res ) => { this.setState({ records: res, loading: false }); } );

	}

	deleteFunction = ( id ) => {

		let removeRecordsPromise = new Promise( ( resolve, reject ) => { removeForm(id, resolve, reject); });
			removeRecordsPromise.then( ( res ) => { alert('Formulario eliminado.') } );

	}

	render() {

		if( this.state.loading ) return ( <div className={ styles.ListContainer }>Cargando...</div> );

		return (
			<div className={ styles.ListContainer }>
				<RecordsTable	title={ this.state.title }
								headers={ this.state.headers } subheaders={ this.state.subheaders } records={ this.state.records }
								createRoute={ this.state.createRoute } updateRoute={ this.state.updateRoute } delete={ this.deleteFunction } />
			</div>
		);
	}

}

export default formList;