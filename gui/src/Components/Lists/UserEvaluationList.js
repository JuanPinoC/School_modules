import React, { Component } from 'react';
import styles from './Styles.css';

import SelectionRecordsTable from '../RecordsTable/SelectionRecordsTable';

import { getUsers } from '../../Functions/FormEditorFunctions';

class userEvaluationList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Usuarios',

			selectButtonLabel: 'Ver perfil',
			recordSelectedRoute: '/userEvaluationProfile?id=',

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

	render() {
		return (
			<div className={ styles.ListContainer }>
				{	
					( this.state.records.length > 0 )? 
						(<SelectionRecordsTable	
								title={ this.state.title } headers={ this.state.headers } 
								subheaders={ this.state.subheaders } records={ this.state.records }
								selectButtonLabel={ this.state.selectButtonLabel }
								recordSelectedRoute={ this.state.recordSelectedRoute } />)
						:(<div>No hay registros para mostrar.</div>)
				}
			</div>
		);
	}

}

export default userEvaluationList;