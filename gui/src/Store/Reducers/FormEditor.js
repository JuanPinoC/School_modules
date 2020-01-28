import {} from '../Actions/FormEditor/actionTypes';

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

	switch ( action.type ) {

		//SECTION
		case CREATE_SECTION:
		
			sections = [ ...sections, { ...sectionInitialState, key: action.key } ];
		
			break;

		case UPDATE_SECTION:

			const index = sections.findIndex( (e) => e.key === action.key );
			sections[ index ] = { ...sections[ index ], name: action.name, type: action.type, weight: action.weight  };

			break;

		case DELETE_SECTION:

			const index = sections.findIndex( (e) => e.key === action.key );
			sections.splice(index, 1);

			break;

		case MOVE_SECTION:

			const index = sections.findIndex( (e) => e.key === key );

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

			const parentIndex = sections.findIndex( (e) => e.key === action.parent );
			sections[ parentIndex ].inputs = [...sections[ parentIndex ].inputs, { ...inputInitialState, key: action.key } ];

			break;

		case UPDATE_INPUT:

			const parentIndex = sections.findIndex( (e) => e.key === action.parent );
			const parentInputs = sections[ parentIndex ].inputs;
			const index = parentInputs.findIndex( (e) => e.key === action.key );

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

			const parentIndex = sections.findIndex( (e) => e.key === action.parent );
			const parentInputs = sections[ parentIndex ].inputs;
			const index = parentInputs.findIndex( (e) => e.key === action.key );

			sections[parentIndex].inputs.splice(index, 1);

			break;

		case MOVE_INPUT:

			const parentIndex = sections.findIndex( (e) => e.key === action.parent );
			const parentInputs = sections[ parentIndex ].inputs;
			const index = parentInputs.findIndex( (e) => e.key === action.key );

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

			const parentIndex = sections.findIndex( (e) => e.key === action.parent );
			const parentInputs = sections[ parentIndex ].inputs;
			const index = parentInputs.findIndex( (e) => e.key === action.key );

			sections[parentIndex].inputs[ index ].options = action.options;

			break;

	}

	state = { sections: sections };

	return state;
};

export default reducer;