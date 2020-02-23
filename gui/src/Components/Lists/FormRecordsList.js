import React, { Component } from 'react';
import styles from './Styles.css';

import RecordsTable from '../RecordsTable/FormRecordsTable';

import { getUrlParams, getFormRecords } from '../../Functions/FormEditorFunctions';

class formRecordsList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			title: 'Registros del Formulario',
			form: {},
			records: []
		};

	}

	componentDidMount () {

		const params = getUrlParams();

		if( params.planId !== null && typeof params.planId !== 'undefined' && 
			params.planFormItemId !== null && typeof params.planFormItemId !== 'undefined' &&
			params.formId !== null && typeof params.formId !== 'undefined' ){

			let getRecordsPromise = new Promise( ( resolve, reject ) => { getFormRecords(params.planId, params.planFormItemId, params.formId, resolve, reject); });
				getRecordsPromise.then( ( data ) => {

					this.setState({
						form: data.form,
						records: data.records
					});

			} );

		}

	}

	render() {
		return (
			<div className={ styles.ListContainer }>
				{	
					( this.state.records.length > 0 )? 
						(<RecordsTable title={ this.state.title } form={ this.state.form } records={ this.state.records } />)
						:(<div>No hay registros para mostrar.</div>)
				}
			</div>
		);
	}

}

export default formRecordsList;