import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC_kzuIqjxfOl5CXMjlB4k0AXDjrWnfYNo",
    authDomain: "sangahan-63b72.firebaseapp.com",
    databaseURL: "https://sangahan-63b72.firebaseio.com",
    projectId: "sangahan-63b72",
    storageBucket: "sangahan-63b72.appspot.com",
    messagingSenderId: "487040657431"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
