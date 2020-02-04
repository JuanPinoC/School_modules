import React from 'react';

import styles from './App.css';

import { BrowserRouter as Router } from "react-router-dom";

import Layout from './Layout/Layout';

function App() {

	return (
		<Router>
			<div className={ styles.AppContainer } >
				<Layout />
			</div>
		</Router>
	);
}

export default App;