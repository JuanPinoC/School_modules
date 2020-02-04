import { createStore, combineReducers } from 'redux';

import formEditorReducer from './Reducers/FormEditor';
import userReducer from './Reducers/User';

const rootReducer = combineReducers({
	formEditor: formEditorReducer,
	user: userReducer,
	// ...
});

const configureStore = () => {
	return createStore( rootReducer );
};

export default configureStore;