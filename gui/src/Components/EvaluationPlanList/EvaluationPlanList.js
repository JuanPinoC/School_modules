import React, { Component } from 'react';
import styles from './Styles.css';

import RecordsTable from '../RecordsTable/RecordsTable';

import { getEvaluationPlans } from '../../Functions/FormEditorFunctions';

class evaluationPlanList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Planes de Evaluación',

			createRoute: '/evaluationPlanForm',
			updateRoute: '/evaluationPlanForm?id=',
			deleteFunction: () => {},

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

		let evaluationPlansPromise = new Promise( ( resolve, reject ) => { getEvaluationPlans(resolve, reject); });
			evaluationPlansPromise.then( ( res ) => { this.setState({ records: res }); } );

	}

	render() {
		return (
			<div className={ styles.ListContainer }>
				{	
					( this.state.records.length > 0 )? 
						(<RecordsTable	title={ this.state.title }
										headers={ this.state.headers } subheaders={ this.state.subheaders } records={ this.state.records }
										createRoute={ this.state.createRoute } updateRoute={ this.state.updateRoute } delete={ this.state.deleteFunction } />)
						:(<div>No hay registros para mostrar.</div>)
				}
			</div>
		);
	}

}

export default evaluationPlanList;