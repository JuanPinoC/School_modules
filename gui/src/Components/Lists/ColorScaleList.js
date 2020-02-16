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
			records: []
		};

	}

	componentDidMount () {

		let getRecordsPromise = new Promise( ( resolve, reject ) => { getColorScales(resolve, reject); });
			getRecordsPromise.then( ( res ) => { this.setState({ records: res }); } );

	}

	deleteFunction = ( id ) => {

		let removeRecordsPromise = new Promise( ( resolve, reject ) => { removeColorScale(id, resolve, reject); });
			removeRecordsPromise.then( ( res ) => { alert('Escala eliminado.') } );

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

export default colorScaleList;