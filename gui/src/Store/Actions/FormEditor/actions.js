import {
		//SECTION
		CREATE_SECTION, UPDATE_SECTION, DELETE_SECTION, MOVE_SECTION,
		//INPUT
		CREATE_INPUT, UPDATE_INPUT, DELETE_INPUT, MOVE_INPUT,
		//OPTION
		UPDATE_OPTIONS

} from './actionTypes';

/* Section */
export const createSection = ( key ) => {
	return {
		type: CREATE_SECTION,
		key: key
	}
};

export const updateSection = ( key, name, type, weight ) => {
	return {
		type: UPDATE_SECTION,
		key: key,
		name: name,
		type: type,
		weight: weight
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

export const updateInput = ( parent, key, label, type, weight, maxValue, minValue ) => {
	return {
		type: UPDATE_INPUT,
		parent: parent,
		key: key,
		label: label,
		type: type,
		weight: weight,
		maxValue: maxValue,
		minValue: minValue
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

export const updateOptions = ( parent, key, options ) => {
	return {
		type: UPDATE_OPTIONS,
		parent: parent,
		key: key,
		options: options
	}
};
