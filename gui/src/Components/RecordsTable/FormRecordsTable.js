import React, { Component } from 'react';
import styles from './Styles.css';

import { Link } from "react-router-dom";

import { randomNumber } from '../../Functions/FormEditorFunctions';

const SectionHeaders = (props) => {

	let inputs = props.inputs;

	let inputNames = inputs.map( (input) => {
		return(
				<th key={ input._id }>{ input.label + ' ' + (( input.evaluatedUserField )? '(Evaluado)' : '') }</th>
			);
	});

	inputNames.push(<th key={ randomNumber() }>Total (Sección)</th>);

	return(
			<>
				{ inputNames }
			</>
		);

};

class recordsTable extends Component {

	constructor (props) {
		super(props);

		this.state = {
			headerViews: [],
			recordViews: []
		};

	}

	componentDidMount () {

		let form = this.props.form;

		form.sections = form.sections.map( (section) => {
			section.inputs.sort( (a, b) => {
							return a.order - b.order;
						});

			return section;
		});

		form.sections.sort( (a, b) => {
							return a.order - b.order;
						});

		this.setHeaderViews( form );

	}

	setHeaderViews = ( form ) => {

		let headersFirstRow = (
								<tr key={ 'r1' + randomNumber() }>
									<th key={ 'e' + randomNumber() } rowSpan='2'>Evaluado</th>
									{ 
										form.sections.map( (section) => 
											(<th key={ randomNumber() } colSpan={ section.inputs.length + 1 }>{ section.name }</th>)
										)
									}
									<th key={ 't' + randomNumber() } rowSpan='2'>Total</th>
								</tr>
							);

		let headersSecondRow = (
			<tr key={ 'r2' + randomNumber() }>
				{
					form.sections.map( (section) => 
						(<SectionHeaders key={ 'r2ths' + randomNumber() } sectionName={ section.name } inputs={ section.inputs } />)
					)
				}
			</tr>
		);

		this.setState({
			headerViews: [ headersFirstRow, headersSecondRow ]
		});



		this.setRecordViews( form.sections, this.props.records );

	}

	setRecordViews = ( formSections, records ) => {

		const scaleItems = this.props.colorScale.items;

		let recordViews = records.map( ( record ) => {

			let answers = [(<td key={ record.evaluated._id + randomNumber() }>{ record.evaluated.name }</td>)];


			formSections.forEach( ( section ) => {

				section.inputs.forEach( ( input ) => {

					const recordItemIndex = record.itemsToShow.findIndex( (e) => e.section + '' === section._id + '' && e.input + '' === input._id + '' );
					const item = record.itemsToShow[recordItemIndex];

					answers.push(<td key={ item.input + randomNumber() }>{ item.answer }</td>);

				});

				answers.push(<td key={ 'st' + record._id + randomNumber() }>{ record.sectionsTotals[section._id] }</td>);

			});


			const scaleIndex = scaleItems.findIndex( (e) => e.max >= record.total && e.min <= record.total );

			answers.push(<td key={'t' + record._id + randomNumber()} 
							style={{ backgroundColor: scaleItems[scaleIndex].color, textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: 'white'}}>
								{ record.total }
						</td>);

			return (
					<tr key={ record._id }>
						{ answers }
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
					<h1>{ this.props.form.name }</h1>
				</div>
				<div className={ styles.OverflowContainer }>
					<table>
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

export default recordsTable;