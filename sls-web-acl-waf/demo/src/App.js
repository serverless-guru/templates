import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App(props) {	
	const [data, setData] = useState({
		message: ""
	});

	const fetchData = async () => {
    try {
			let options = {
				headers: {
					"x-api-key" : ""
				} 
			}
	
			const result = await axios(
				'https://ih0cnxvqk5.execute-api.ca-central-1.amazonaws.com/dev/v1/test',
				options
			);

			return result;
    } catch (error) {
      throw error;
    }
};

useEffect(() => {
    fetchData()
        .then( result => {
					setData(data => ({ ...data, message: result.data.message}));
				})
        .catch(error => {
            console.warn(JSON.stringify(error, null, 2));
        });
}, [props.message]);

  return (
    <div className="App">
			<h3>{data.message}</h3>
    </div>
	);
}

export default App;
