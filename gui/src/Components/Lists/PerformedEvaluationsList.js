import React, { Component } from 'react';
import styles from './Styles.css';

import SelectionRecordsTable from '../RecordsTable/SelectionRecordsTable';

import { getRecordsByEvaluator } from '../../Functions/FormEditorFunctions';

class performedEvaluationsList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Evaluaciones Realizadas',

			selectButtonLabel: 'Modificar',
			recordSelectedRoute: '/fillableForm?id=',

			headers: [
						{ name: '_id', label: 'ID' },
						{ name: 'plan', label: 'Plan' },
						{ name: 'form', label: 'Formulario' },
						{ name: 'evaluated', label: 'Evaluado' },
						{ name: 'completed', label: 'Completado' }
					],
			subheaders: [ 
							{ name: 'plan', fields: ['name'] },
							{ name: 'form', fields: ['name'] },
							{ name: 'evaluated', fields: ['name'] }, 
						],

			records: []
		};

	}

	componentDidMount () {

		let getRecordsPromise = new Promise( ( resolve, reject ) => { getRecordsByEvaluator(resolve, reject); });
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

export default performedEvaluationsList;