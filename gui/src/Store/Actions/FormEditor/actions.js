import {

		//FORM
		SET_FORM, UPDATE_FORM,
		//SECTION
		CREATE_SECTION, UPDATE_SECTION, DELETE_SECTION, MOVE_SECTION,
		//INPUT
		CREATE_INPUT, UPDATE_INPUT, DELETE_INPUT, MOVE_INPUT,

		//REMOVE DATA
		REMOVE_FORM_EDITOR_DATA

} from './actionTypes';

/* Form */
export const setForm = ( form ) => {
	return {
		type: SET_FORM,
		form: form
	}
}

export const updateForm = ( field, value ) => {
	return {
		type: UPDATE_FORM,
		field: field,
		value: value
	}
}


/* Section */
export const createSection = ( key ) => {
	return {
		type: CREATE_SECTION,
		key: key
	}
};

export const updateSection = ( key, field, value ) => {
	return {
		type: UPDATE_SECTION,
		key: key,
		field: field,
		value: value
	}
};

export const deleteSection = ( key ) => {
	return {
		type: DELETE_SECTION,
		key: key
	}
};

export const moveSection = ( key, direction ) => {
	return {
		type: MOVE_SECTION,
		key: key,
		direction: direction
	}
};

/* Input */
export const createInput = ( parent, key ) => {
	return {
		type: CREATE_INPUT,
		parent: parent,
		key: key
	}
};

export const updateInput = ( parent, key, field, value ) => {
	return {
		type: UPDATE_INPUT,
		parent: parent,
		key: key,
		field: field,
		value: value
	}
};

export const deleteInput = ( parent, key ) => {
	return {
		type: DELETE_INPUT,
		parent: parent,
		key: key
	}
};

export const moveInput = ( parent, key, direction ) => {
	return {
		type: MOVE_INPUT,
		parent: parent,
		key: key,
		direction: direction
	}
};


export const removeFormEditorData = () => {
	return {
		type: REMOVE_FORM_EDITOR_DATA
	}
};
