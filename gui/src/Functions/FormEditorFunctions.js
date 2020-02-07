
import axios from '../Axios/Axios';

export const FormTypes = [
			{ _id:'Soft Abilities' , name:'Habilidades blandas' },
			{ _id:'Hard Abilities' , name:'Observación en clase' },
			{ _id:'Interview' , name:'Entrevista' }
];

export const FormActions = [
			{ _id:'sum' , name:'Sumar' },
			{ _id:'avg' , name:'Promediar' },
			{ _id:'none' , name:'Ninguna' }
];

export const getColorScales = (resolve, reject) => {
		
	axios.get(
				'colorScale/',
				{ headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken') } } 
		)
		.then( (res) => {
			resolve(res.data.records);
		})
		.catch( (err) => {
			reject()
		});

};

export const getUsers = (resolve, reject) => {
		
	axios.get(
				'user/',
				{ headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken') } } 
		)
		.then( (res) => {
			resolve(res.data.records);
		})
		.catch( (err) => {
			reject()
		});

};

export const InputTypes = [
			{
				value: 'Number',
				label: 'Númerica',
				config: {
						showWeight: true,
						showOptions: false,
						showMaxValue: true,
						showMinValue: true
				}
			},
			{
				value: 'Text',
				label: 'Textual',
				config: {
						showWeight: false,
						showOptions: false,
						showMaxValue: true,
						showMinValue: true
				}
			},
			{
				value: 'Number Options',
				label: 'Opción Múltiple Númerica',
				config: {
						showWeight: true,
						showOptions: true,
						showMaxValue: false,
						showMinValue: false
				}
			},
			{
				value: 'Text Options',
				label: 'Opción Múltiple Textual',
				config: {
						showWeight: false,
						showOptions: true,
						showMaxValue: false,
						showMinValue: false
				}
			}
];

export const moveElementInArray = ( array, key, direction ) => {

	const index = array.findIndex( (e) => e.key === key );

	if(direction === 'up' && index !== 0){
		const x = array[ index - 1];
		const y = array[ index ];

		array[ index - 1 ] = y;
		array[ index ] = x ;
	}
	else if( direction === 'down' && index !== array.length - 1 ){
		const x = array[ index + 1];
		const y = array[ index ];

		array[ index + 1 ] = y;
		array[ index ] = x ;
	}

	return array;
};


