import { createStore, combineReducers } from 'redux';

import formEditorReducer from './Reducers/FormEditor';

const rootReducer = combineReducers({
	formEditor: formEditorReducer
	// ...
});

const configureStore = () => {
	return createStore( rootReducer );
};

export default configureStore;