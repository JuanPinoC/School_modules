import React, { Component } from 'react';
import styles from './Styles.css';

import RecordsTable from '../RecordsTable/FormRecordsTable';

import { getUrlParams, getFormRecordsByUser, getColorScaleByForm } from '../../Functions/FormEditorFunctions';

class formRecordsList extends Component {

	constructor (props) {
		super(props);

		this.state = {
			formId: '',
			title: 'Registros del Formulario',
			form: {},
			colorScale: {},
			records: []
		};

	}

	componentDidMount () {

		const params = getUrlParams();

		if( params.planId !== null && typeof params.planId !== 'undefined' && 
			params.planFormItemId !== null && typeof params.planFormItemId !== 'undefined' &&
			params.formId !== null && typeof params.formId !== 'undefined' ){

			let getRecordsPromise = new Promise( ( resolve, reject ) => { getFormRecordsByUser(params.planId, params.planFormItemId, params.formId, resolve, reject); });
				getRecordsPromise.then( ( data ) => {

					let getScalePromise = new Promise( ( resolve, reject ) => { getColorScaleByForm(params.formId, resolve, reject); });
					getScalePromise.then( ( colorScale ) => {

						this.setState({
							formId: params.formId,
							form: data.form,
							colorScale: colorScale,
							records: data.records
						});

					});

			} );

		}

	}

	render() {
		return (
			<div className={ styles.ListContainer }>
				{	
					( this.state.records.length > 0 )? 
						(<RecordsTable title={ this.state.title } 
							formId={ this.state.formId } form={ this.state.form } 
							colorScale={ this.state.colorScale } records={ this.state.records } />)
						:(<div>No hay registros para mostrar.</div>)
				}
			</div>
		);
	}

}

export default formRecordsList;