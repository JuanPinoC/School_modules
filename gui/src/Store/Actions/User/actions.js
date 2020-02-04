import {

		SET_USER_DATA,
		REMOVE_USER_DATA

} from './actionTypes';


export const setUserData = ( token, name, email, type ) => {
	return {
		type: SET_USER_DATA,
		token: token,
		name: name,
		email: email,
		userType: type
	}
}

export const removeUserData = ( ) => {
	return {
		type: REMOVE_USER_DATA
	}
}