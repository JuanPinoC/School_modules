import {

		CREATE_SECTION, UPDATE_SECTION, DELETE_SECTION, MOVE_SECTION,
		CREATE_INPUT, UPDATE_INPUT, DELETE_INPUT, MOVE_INPUT,
		UPDATE_OPTIONS

} from '../Actions/FormEditor/actionTypes';

const formInitialState = {
			sections: []
		};

const sectionInitialState = {
			key: '',
			name: '',
			type: 'sum',
			weight: 0,
			inputs: []
		};

const inputInitialState = {
			key: '',
			label:	'',
			type:	'Number',
			weight: 0,
			maxValue: 0,
			minValue: 0,
			options: []
		};

const reducer = ( oldState = formInitialState, action) => {

	let state = {};
	let sections = oldState.sections;
	
	let parentIndex = ( typeof action.parent !== 'undefined' )? sections.findIndex( (e) => e.key === action.parent ) : null;
	let parentInputs = ( typeof action.parent !== 'undefined' )? sections[ parentIndex ].inputs : [];
	let index = ( typeof action.parent !== 'undefined' )? parentInputs.findIndex( (e) => e.key === action.key ) : sections.findIndex( (e) => e.key === action.key ) ;

	switch ( action.type ) {

		//SECTION
		case CREATE_SECTION:
		
			sections = [ ...sections, { ...sectionInitialState, key: action.key } ];
		
			break;

		case UPDATE_SECTION:

			sections[ index ] = { ...sections[ index ], name: action.name, type: action.type, weight: action.weight  };

			break;

		case DELETE_SECTION:
		
			sections.splice(index, 1);

			break;

		case MOVE_SECTION:

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

			break;


		//INPUT
		case CREATE_INPUT:

			sections[ parentIndex ].inputs = [...sections[ parentIndex ].inputs, { ...inputInitialState, key: action.key } ];

			break;

		case UPDATE_INPUT:

			sections[parentIndex].inputs[index] = { 
													...sections[parentIndex].inputs[index],
													label: action.label,
													type: action.type,
													weight: action.weight,
													maxValue: action.maxValue,
													minValue: action.minValue
												};

			break;

		case DELETE_INPUT:

			sections[parentIndex].inputs.splice(index, 1);

			break;

		case MOVE_INPUT:

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

			break;



		//OPTION
		case UPDATE_OPTIONS:

			sections[parentIndex].inputs[ index ].options = action.options;

			break;

	}

	state = { sections: sections };

	return state;
};

export default reducer;