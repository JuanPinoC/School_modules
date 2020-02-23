import React, { Component } from 'react';
import styles from './Styles.css';

import { Link } from "react-router-dom";

import { randomNumber } from '../../Functions/FormEditorFunctions';


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

	setHeaderViews = ( headers ) => {

		const headerViews = headers.map( ( e ) => {
			return (<th key={ 'th' + randomNumber() }>{ e.label }</th>);
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

					if( typeof subrecord.length !== 'undefined' ){
						let subrecordData = subrecord.map( ( subrecordItem ) => {

								let subrecordItemData = subheaderFields.map( ( subheaderField ) => {
									return (<li key={ 'itd' + randomNumber() }>{ subrecordItem[ subheaderField ] }</li>);
								});

								return (<ul key={ 'itr' + randomNumber() }>{ subrecordItemData }</ul>);

							});

						return (<td key={ 'p' + randomNumber() }>{ subrecordData }</td>);
					}

					let subrecordData = subheaderFields.map( ( subheaderField ) => {
						return (<p key={ 'p' + randomNumber() }>{ subrecord[ subheaderField ] }</p>);
					});

					return (<td key={ 'td' + randomNumber() }>{ subrecordData }</td>);

				}else{
					return (<td key={ 'td' + randomNumber() }>
								{ (typeof record[ header.name ] === 'boolean')? ( (record[ header.name ])?'Sí':'No' ) : record[ header.name ] }
							</td>);
				}
			});

			fields.push(<td key={ 'tdl1' + randomNumber() }> 
							<Link className={ styles.TableOption } 
									to={ this.props.recordSelectedRoute + record._id }>
								{ this.props.selectButtonLabel }
							</Link>
						</td>);

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