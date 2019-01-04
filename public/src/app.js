require('./styles/chat.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { Provider } from "mobx-react";
import store from "./store";

ReactDOM.render(
    <Provider  {...store}>
        <App />
    </Provider>
    , document.getElementById('app'));