import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Form from './components/Form';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import store from "./store";
import { Provider } from 'react-redux';

const Root = () => (
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path="/" component={App} />
                <Route exact path="/upload" component={Form} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/login" component={Login} />
            </div>
        </BrowserRouter>
    </Provider>
);

//TODO
/*
    <ProtectedRoute exact path="/upload" component={Form} />
    <Route exact path="/user/:username" component={User} />*/

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
