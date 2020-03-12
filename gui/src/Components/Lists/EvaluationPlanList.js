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
			records: [],
			loading: true
		};

	}

	componentDidMount () {

		let getRecordsPromise = new Promise( ( resolve, reject ) => { getEvaluationPlans(resolve, reject); });
			getRecordsPromise.then( ( res ) => { this.setState({ records: res, loading: false }); } );

	}

	deleteFunction = ( id ) => {

		let removeRecordsPromise = new Promise( ( resolve, reject ) => { removeEvaluationPlan(id, resolve, reject); });
			removeRecordsPromise.then( ( res ) => { alert('Plan eliminado.') } );

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

export default evaluationPlanList;