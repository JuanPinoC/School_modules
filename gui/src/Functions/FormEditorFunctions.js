
import axios from '../Axios/Axios';


export const getToken = () => {
	return localStorage.getItem('jwtToken');
};

export const getUrlParams = () => {

	let url = window.location.href;

	let paramsString = url.slice( url.indexOf('?') + 1 );

	const paramsStringArray = paramsString.split('&');

	let params = {};

	paramsStringArray.map( (string) => {

		const stringParts = string.split('=');

		params[ stringParts[0] ] = stringParts[1];

	});

	return params;

};


export const getUsers = (resolve, reject) => {
		
	axios.get(
				'user/',
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( (res) => {
			resolve(res.data.records);
		})
		.catch( (err) => {
			reject();
		});

};

export const getUser = (id, resolve, reject) => {

	axios.get(
				'user/find?id=' + id,
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data);
		})
		.catch( (res) => {
			reject();
		});

};

export const removeUser = (id, resolve, reject) => {

	axios.get(
			'user/delete?id=' + id,
			{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
	)
	.then( ( res ) => {
		resolve(res.data);
	})
	.catch( (res) => {
		reject();
	});

};

export const getUserTypes = (resolve, reject) => {
		
	axios.get(
				'userType/',
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data.records);
		})
		.catch( (res) => {
			reject();
		});

};

export const getEvaluationPlans = (resolve, reject) => {

	axios.get(
				'evaluationPlan/',
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data.records);
		})
		.catch( (res) => {
			reject();
		});

};

export const getEvaluationPlan = (id, resolve, reject) => {

	axios.get(
				'evaluationPlan/find?id=' + id,
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data);
		})
		.catch( (res) => {
			reject();
		});

};

export const removeEvaluationPlan = (id, resolve, reject) => {

	axios.get(
				'evaluationPlan/delete?id=' + id,
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data);
		})
		.catch( (res) => {
			reject();
		});

};

export const getColorScales = (resolve, reject) => {
		
	axios.get(
				'colorScale/',
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( (res) => {
			resolve(res.data.records);
		})
		.catch( (err) => {
			reject();
		});

};

export const getColorScale = (id, resolve, reject) => {

	axios.get(
				'colorScale/find?id=' + id,
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data);
		})
		.catch( (res) => {
			reject();
		});

};

export const removeColorScale = (id, resolve, reject) => {

	axios.get(
				'colorScale/delete?id=' + id,
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data);
		})
		.catch( (res) => {
			reject();
		});

};

export const getForms = (resolve, reject) => {

	axios.get(
				'formEditor/',
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data.records);
		})
		.catch( (res) => {
			reject();
		});

};

export const getForm = (id, resolve, reject) => {
		
	axios.get(
			'formEditor/find?id=' + id,
			{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
	)
	.then( (res) => {
		resolve(res.data);
	})
	.catch( (err) => {
		reject();		
	});

};

export const removeForm = (id, resolve, reject) => {

	axios.get(
				'formEditor/delete?id=' + id,
				{ headers: { 'Authorization': 'Bearer ' + getToken() } } 
		)
		.then( ( res ) => {
			resolve(res.data);
		})
		.catch( (res) => {
			reject();
		});
		
};

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

export const InputTypes = [
			{
				value: 'Number',
				label: 'Númerica',
				config: {
						showOptions: false,
						showMaxValue: true,
						showMinValue: true
				}
			},
			{
				value: 'Text',
				label: 'Textual',
				config: {
						showOptions: false,
						showMaxValue: true,
						showMinValue: true
				}
			},
			{
				value: 'Number Options',
				label: 'Opción Múltiple Númerica',
				config: {
						showOptions: true,
						showMaxValue: false,
						showMinValue: false
				}
			},
			{
				value: 'Text Options',
				label: 'Opción Múltiple Textual',
				config: {
						showOptions: true,
						showMaxValue: false,
						showMinValue: false
				}
			}
];

export const dateToYearMonthDay = ( date ) => {

	return date.split('T')[0];
	
};

export const moveElementInArray = ( array, key, direction, givenIndex = null ) => {

	let index = ( givenIndex !== null )?
					givenIndex : array.findIndex( (e) => e.key === key || e._id === key || e.id === key );

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

export const randomNumber = () => {

	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( let i = 0; i < 10; i++ ) {
		result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
	}
	return result;

};

