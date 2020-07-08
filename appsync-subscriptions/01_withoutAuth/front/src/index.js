import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/App/Container';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';

Amplify.configure({
  "aws_appsync_graphqlEndpoint": process.env.REACT_APP_URL,
  "aws_appsync_region": process.env.REACT_APP_REGION,
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": process.env.REACT_APP_API_KEY
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
