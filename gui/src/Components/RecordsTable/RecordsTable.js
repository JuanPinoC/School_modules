import React, { Component } from 'react';
import styles from './Styles.css';

class recordsTable extends Component {

	render() {
		return (
			<div className={ styles.TableContainer }>

				<div className={ styles.TitleContainer }>
					<h1>Registros de Evaluaciones</h1>
				</div>
				<div className={ styles.OverflowContainer }>
					<table>
						<thead>
							<tr>
								<th className={ styles.TableItem }>First Name</th>
								<th>Last Name</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
								<th>Points</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Jill</td>
								<td>Smith</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
								<td>50</td>
							</tr>
							<tr>
								<td>Eve</td>
								<td>Jackson</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
								<td>94</td>
							</tr>
							<tr>
								<td>Adam</td>
								<td>Johnson</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
								<td>67</td>
							</tr>
						</tbody>
					</table>
				</div>
				
			</div>
		);
	}

}

export default recordsTable;