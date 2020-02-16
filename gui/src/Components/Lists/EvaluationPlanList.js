import React, { Component } from 'react';
import styles from './Styles.css';

import RecordsTable from '../RecordsTable/RecordsTable';

import { getEvaluationPlans, removeEvaluationPlan } from '../../Functions/FormEditorFunctions';

class evaluationPlanList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Planes de Evaluación',

			createRoute: '/evaluationPlanForm',
			updateRoute: '/evaluationPlanForm?id=',

			headers: [
						{ name: '_id', label: 'ID' }, 
						{ name: 'name', label: 'Nombre' },
						{ name: 'userType', label: 'Tipo de usuario' },
						{ name: 'startDate', label: 'Fecha de Inicio' },
						{ name: 'endDate', label: 'Fecha de Fin' }
					],
			subheaders: [ { name: 'userType', fields: ['name'] } ],
			records: []
		};

	}

	componentDidMount () {

		let getRecordsPromise = new Promise( ( resolve, reject ) => { getEvaluationPlans(resolve, reject); });
			getRecordsPromise.then( ( res ) => { this.setState({ records: res }); } );

	}

	deleteFunction = ( id ) => {

		let removeRecordsPromise = new Promise( ( resolve, reject ) => { removeEvaluationPlan(id, resolve, reject); });
			removeRecordsPromise.then( ( res ) => { alert('Plan eliminado.') } );

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

export default evaluationPlanList;