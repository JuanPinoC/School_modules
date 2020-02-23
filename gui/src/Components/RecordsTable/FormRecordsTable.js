import React, { Component } from 'react';
import styles from './Styles.css';

import { Link } from "react-router-dom";

import { randomNumber } from '../../Functions/FormEditorFunctions';

const SectionHeaders = (props) => {

	let inputNames = props.inputs.map( (input) => {
		return(
				<td key={ input._id }>{ input.label + ' ' + ( input.evaluatedUserField )? '(Evaluado)' : '' }</td>
			);
	});

	inputNames.push(<td key={ randomNumber() }>Total (Sección)</td>);

	return(
			<tr>{ inputNames }</tr>
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

		this.setHeaderViews( this.props.form );

	}

	setHeaderViews = ( form ) => {

		let headerViews = form.sections.map( (section) => {
			return (<th key={ section._id }>
						<td>{ section.name }</td>
						<SectionHeaders inputs={ section.inputs } />
					</th>);
		});

		this.setState({
			headerViews: [ (<th key={ randomNumber() }>Evaluado</th>), ...headerViews, (<th key={ randomNumber() }>Total</th>) ]
		});

		this.setRecordViews( form.sections, this.props.records );

	}

	setRecordViews = ( formSections, records ) => {

		let recordViews = records.map( ( record ) => {

			answers = [(<td>{ record.evaluated }</td>)];

			for(let s = 0; s < formSections.length - 1; s++){

				const sectionIndex = sections.findIndex( (e) => e.order === s);
				const section = sections[s];

				for(let i = 0; section.inputs.length - 1; i++){

					const inputIndex = section.inputs.findIndex( (e) => e.order === i );
					const input = section.inputs[inputIndex];

					const recordItemIndex = record.itemsToShow.findIndex( (e) => e.section + '' === section._id + '' && e.input + '' === input._id + '' );
					const item = record.itemsToShow[recordItemIndex];

					answers.push(<td>{ item.answer }</td>);

				}

				answers.push(<td>{ record.sectionsTotals[section._id] }</td>);

			}

			answers.push(<td>{ record.total }</td>);

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
							<tr>
								{ this.state.headerViews }
							</tr>
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