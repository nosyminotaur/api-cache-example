import React, { useState } from "react";
import "./App.css";
import { client } from "./baseClient";

function App() {
	const [response, setResponse] = useState("");
	const [cacheMessage, setCacheMessage] = useState("");
	const [timeTaken, setTimeTaken] = useState<number | null>(null);
	const onClickHandler = () => {
		const startDate = Date.now();
		client.get("/weather").then(res => {
			setTimeTaken(Date.now() - startDate);
			if (res.headers.cached === true) {
				setCacheMessage('Serving from cache 🤩');
			} else {
				setCacheMessage('Serving fresh  🥰');
			}
			setResponse(JSON.stringify(res.data, null, "\t"));
		});
	};
	return (
		<div className="App">
			<header className="App-header">
				<button className='button button--ujarak button--text-thick' onClick={onClickHandler}>Fetch Data</button>
				<h3>{response}</h3>
				<h4>{cacheMessage}</h4>
				<h4 style={{display: timeTaken ? 'inherit' : 'none'}}>Time taken: {timeTaken}ms</h4>
			</header>
		</div>
	);
}

export default App;
