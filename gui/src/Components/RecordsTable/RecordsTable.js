import React, { Component } from 'react';
import styles from './Styles.css';

import { Link } from "react-router-dom";

class recordsTable extends Component {

	constructor (props) {
		super(props);

		this.state = {
			headerViews: [],
			recordViews: []
		};

	}

	componentDidMount () {

		this.setHeaderViews( this.props.headers );
		this.setRecordViews( this.props.headers, this.props.subheaders, this.props.records );

	}

	deleteRecord = ( id ) => {

		this.props.delete( id );

		let recordViews = this.state.recordViews;

		const index = recordViews.findIndex( ( record ) => record.key === id );

		recordViews.splice(index, 1);

	}

	setHeaderViews = ( headers ) => {

		const headerViews = headers.map( ( e ) => {
			return (<th>{ e.label }</th>);
		});

		this.setState({
			headerViews:headerViews
		});

	}

	setRecordViews = ( headers, subheaders, records ) => {

		let recordViews = records.map( ( record ) => {

			let	fields = headers.map ( ( header ) => {

				const subheaderId = subheaders.findIndex( ( subheader ) => subheader.name === header.name );

				if( subheaderId >= 0 ){

					const subrecord = record[ header.name ];
					const subheaderFields = subheaders[ subheaderId ].fields;

					let subrecordData = subheaderFields.map( ( subheaderField ) => {

						return (<p>{ subrecord[ subheaderField ] }</p>);

					});

					return (<td>{ subrecordData }</td>);

				}else{
					return (<td>{ record[ header.name ] }</td>);
				}
			});

			fields.push( <td> <Link className={ styles.TableOption } to={ this.props.updateRoute + record._id }>Editar</Link> </td> );
			fields.push( <td> <a className={ styles.TableOption } onClick={ () => { this.deleteRecord( record._id ) } }>Eliminar</a> </td>);


			return (
					<tr key={ record._id }>
						{ fields }		
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
					<h1>{ this.props.title }</h1>
				</div>
				<Link className={ [ styles.TableOption, styles.BigSizeOption ].join(' ') } to={ this.props.createRoute }>Crear Nuevo +</Link>
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