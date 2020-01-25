import React from 'react';
import logo from './logo.svg';

import styles from './App.css';

import FormEditor from './Components/FormEditor/FormEditor';

function App() {

	const formEditorData = {
		name: 'Formulario 1',
		type: 'Soft Abilities',
		weight: 100,
		subforms: [
			{
				name: 'Seccion 1',
				type: 'sum',
				weight: 40,
				inputs: [
					{
						label:	'Pregunta Númerica',
						type:	'Number',
						weight: 100,
						options: [],
						maxValue: 20,
						minValue: 0
					},
					{
						label:	'Pregunta Textual',
						type:	'Text',
						weight: 0,
						options: [],
						maxValue: 250,
						minValue: 50
					}
				]
			},
			{
				name: 'Seccion 2',
				type: 'avg',
				weight: 60,
				inputs: [
					{
						label:	'Pregunta de Opción Múltiple Númerica',
						type:	'Number Options',
						weight: 100,
						options: [ 
							{ label: "Siempre" , value: 20 },
							{ label: "Casi siempre" , value: 15 },
							{ label: "Normalmente" , value: 10 },
							{ label: "A veces" , value: 5 },
							{ label: "Nunca" , value: 0 }
						],
						maxValue: null,
						minValue: null
					},
					{
						label:	'Pregunta de Opción Múltiple Textual',
						type:	'Text Options',
						weight: 0,
						options: [ 
							{ label: "Sí" , value: "Sí" },
							{ label: "No" , value: "No" }
						],
						maxValue: null,
						minValue: null
					}
				]
			}
		],
	};

	return (
		<div>
			<FormEditor data={formEditorData} />			
		</div>
	);
}

export default App;
