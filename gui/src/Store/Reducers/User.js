import {
		SET_USER_DATA, 
		REMOVE_USER_DATA,

} from '../Actions/User/actionTypes';


const userInitialState = {
			token: localStorage.getItem('jwtToken'),
			name: '',
			email: '',
			type: ''
		};

const reducer = ( oldState = userInitialState, action) => {
	
	let state = { ...oldState };

	switch ( action.type ) {
		
		case SET_USER_DATA:

			localStorage.setItem('jwtToken', action.token)

			state = {
				token: action.token,
				name: action.name,
				email: action.email,
				type: action.userType
			};

			break;

		case REMOVE_USER_DATA:

			localStorage.removeItem('jwtToken');

			state = {
				...userInitialState,
				token:''
			};
	
			break;

		default:
			break;

	}

	return state;
};

export default reducer;