import {
		SET_FORM, UPDATE_FORM,
		CREATE_SECTION, UPDATE_SECTION, DELETE_SECTION, MOVE_SECTION,
		CREATE_INPUT, UPDATE_INPUT, DELETE_INPUT, MOVE_INPUT,

		REMOVE_FORM_EDITOR_DATA

} from '../Actions/FormEditor/actionTypes';

import { moveElementInArray } from '../../Functions/FormEditorFunctions';

const formInitialState = {
			name: '',
			type: 'Soft Abilities',
			action: 'sum',
			description: '',
			sections: [],
			colorScale: ''
		};

const sectionInitialState = {
			key: '',
			name: '',
			action: 'sum',
			inputs: []
		};

const inputInitialState = {
			key: '',
			label:	'',
			type:	'Number',
			maxValue: 0,
			minValue: 0,
			options: [],
			evaluatedUserField: false
		};

const reducer = ( oldState = formInitialState, action) => {

	let state = {};
	let sections = oldState.sections;

	let parentIndex = ( typeof action.parent !== 'undefined' && action.parent !== null )? sections.findIndex( (e) => e.key === action.parent || e._id === action.parent || e.id === action.parent ) : null;
	let parentInputs = ( typeof action.parent !== 'undefined' && action.parent !== null )? sections[ parentIndex ].inputs : [];

	let index = ( typeof action.parent !== 'undefined' )? 
						parentInputs.findIndex( (e) => e.key === action.key || e._id === action.key || e.id === action.key ) : 
						( typeof action.key !== 'undefined' )?
						sections.findIndex( (e) => e.key === action.key || e._id === action.key || e.id === action.key) : 0;


	switch ( action.type ) {
		
		//FORM
		case SET_FORM:

			return action.form;
		
			break;

		case UPDATE_FORM:
	
			return {
				...oldState,
				[action.field]: action.value
			};
	
			break;


		//SECTION
		case CREATE_SECTION:
		
			sections = [ ...sections, { ...sectionInitialState, key: action.key } ];
		
			break;

		case UPDATE_SECTION:

			sections[ index ] = { ...sections[ index ], [action.field]: action.value  };

			break;

		case DELETE_SECTION:
		
			sections.splice(index, 1);

			break;

		case MOVE_SECTION:
/*
			if(action.direction === 'up' && index !== 0){
				const x = sections[ index - 1];
				const y = sections[ index ];

				sections[ index - 1 ] = y;
				sections[ index ] = x ;
			}
			else if( action.direction === 'down' && index !== sections.length - 1 ){
				const x = sections[ index + 1];
				const y = sections[ index ];

				sections[ index + 1 ] = y;
				sections[ index ] = x ;
			}
*/
			sections = moveElementInArray( sections, null, action.direction, index );

			break;


		//INPUT
		case CREATE_INPUT:

			sections[ parentIndex ].inputs = [ ...sections[ parentIndex ].inputs, { ...inputInitialState, key: action.key } ];

			break;

		case UPDATE_INPUT:

			sections[parentIndex].inputs[index] = { 
													...sections[parentIndex].inputs[index],
													[action.field]: action.value
												};

			break;

		case DELETE_INPUT:

			sections[parentIndex].inputs.splice(index, 1);

			break;

		case MOVE_INPUT:
/*
			if(action.direction === 'up' && index !== 0){
				const x = sections[parentIndex].inputs[ index - 1];
				const y = sections[parentIndex].inputs[ index ];

				sections[parentIndex].inputs[ index - 1 ] = y;
				sections[parentIndex].inputs[ index ] = x ;
			}
			else if( action.direction === 'down' && index !== sections[parentIndex].inputs.length - 1 ){
				const x = sections[parentIndex].inputs[ index + 1];
				const y = sections[parentIndex].inputs[ index ];

				sections[parentIndex].inputs[ index + 1 ] = y;
				sections[parentIndex].inputs[ index ] = x ;
			}
*/
			sections[parentIndex].inputs = moveElementInArray( sections[parentIndex].inputs, null, action.direction, index );

			break;

		case REMOVE_FORM_EDITOR_DATA:

			return formInitialState;

			break;

		default:
			break;
	}


	state = { ...oldState, sections: sections };

	return state;
};

export default reducer;