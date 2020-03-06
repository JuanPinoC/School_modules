import React, { Component } from 'react';
import styles from './Styles.css';

import { Link } from "react-router-dom";

import { randomNumber, getColorScalesByFormsArray } from '../../Functions/FormEditorFunctions';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

class planRecordsTable extends Component {

	constructor (props) {
		super(props);

		this.state = {
			tableId: this.props.planId + randomNumber(),
			colorScales: [],
			headerViews: [],
			recordViews: []
		};

	}

	componentDidMount () {

		const formIds = this.props.forms.map( (form) => {
			return form._id
		});

		let colorScalesPromise = new Promise( ( resolve, reject ) => { getColorScalesByFormsArray(formIds, resolve, reject); });
		colorScalesPromise.then( ( res ) => {

			this.setState({ colorScales: res });
			this.setHeaderViews( this.props.forms );

		});
		
	}

	setHeaderViews = ( forms ) => {

		let headersFirstRow = (
								<tr key={ 'r1' + randomNumber() }>
									<th key={ 'e' + randomNumber() } rowSpan='2'>Evaluado</th>
									{ 
										forms.map( (form) => 
											(<th key={ randomNumber() } colSpan={ 2 }>{ form.name + ' (' + form.weight + ')'}</th>)
										)
									}
									<th key={ 't' + randomNumber() } rowSpan='2'>PromedioTotal</th>
								</tr>
							);

		let headersSecondRow = (
			<tr key={ 'r2' + randomNumber() }>
				{
					forms.map( (form) => 
						(<><th>Promedio</th><th>Completado</th></>)
					)
				}
			</tr>
		);

		this.setState({
			headerViews: [ headersFirstRow, headersSecondRow ]
		});

		this.setRecordViews( forms, this.props.records );

	}

	setRecordViews = ( forms, records ) => {

		let recordViews = records.map( ( record ) => {

			let view = [(<td key={ record.evaluated._id + randomNumber() }>{ record.evaluated.name }</td>)];

			forms.forEach( ( form ) => {

				const recordItemIndex = record.formAvgs.findIndex( (e) => form._id + '' === e.formId + '' );
				const item = record.formAvgs[recordItemIndex];

				const colorScales = this.state.colorScales;

				const colorScaleIndex = colorScales.findIndex( (e) => form.colorScale + '' === e._id + '' );

				const scalesIndex = colorScales[colorScaleIndex].items.findIndex( (e) => e.max >= record.formAvgs[recordItemIndex].total && record.formAvgs[recordItemIndex].total >= e.min);

				view.push(<td key={ 'formTotal' + form._id + randomNumber() } 
								style={{	backgroundColor: colorScales[colorScaleIndex].items[scalesIndex].color, 
											textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
											color: 'white'
										}}
					>{ record.formAvgs[recordItemIndex].total }</td>);
				view.push(<td key={ 'formCompleted' + form._id + randomNumber() }>{ (record.formAvgs[recordItemIndex].completed)? 'Sí' : 'No' }</td>);

			});

			view.push(<td key={'t' + record._id + randomNumber()}>{ record.total }</td>);

			return (
					<tr key={ 'record' + randomNumber() }>
						{ view }
					</tr>
				);
		});

		this.setState({
			recordViews: recordViews
		});

	}

	render() {

		return (
			<div className={ styles.TableContainer }>
				<div className={ styles.TitleContainer }>
					<h2>{ this.props.title }</h2>
					<ReactHTMLTableToExcel
						id="test-table-xls-button"
						className={ styles.TableExcelButton }
						table={ this.state.tableId }
						filename="registrosxls"
						sheet="registros"
						buttonText="Descargar como XLS"/>
				</div>

				<div className={ styles.OverflowContainer }>
					<table id={ this.state.tableId }>
						<thead>

								{ this.state.headerViews }

						</thead>
						<tbody>
							{ this.state.recordViews }
						</tbody>
					</table>
				</div>
			</div>
		);
	}

}

export default planRecordsTable;