import { UPDATE_SECTIONS } from './actionTypes';

export const updateSections = ( sections ) => {

	return {
		type: UPDATE_SECTIONS,
		sections: sections
	}

}