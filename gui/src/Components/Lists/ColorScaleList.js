import React, { Component } from 'react';
import styles from './Styles.css';

import RecordsTable from '../RecordsTable/RecordsTable';

import { getColorScales, removeColorScale } from '../../Functions/FormEditorFunctions';

class colorScaleList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Escalas de Color',

			createRoute: '/colorScaleForm',
			updateRoute: '/colorScaleForm?id=',

			headers: [
						{ name: '_id', label: 'ID' }, 
						{ name: 'name', label: 'Nombre' },
						{ name: 'items', label: 'Items' }
					],
			subheaders: [ { name: 'items', fields: ['label'] } ],
			records: [],

			loading: true
		};

	}

	componentDidMount () {

		let getRecordsPromise = new Promise( ( resolve, reject ) => { getColorScales(resolve, reject); });
			getRecordsPromise.then( ( res ) => { this.setState({ records: res, loading: false }); } );

	}

	deleteFunction = ( id ) => {

		let removeRecordsPromise = new Promise( ( resolve, reject ) => { removeColorScale(id, resolve, reject); });
			removeRecordsPromise.then( ( res ) => { alert('Escala eliminado.') } );

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

export default colorScaleList;