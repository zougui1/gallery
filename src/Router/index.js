import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';

import App from '../components/App';
import Form from '../components/Form';
import Signup from '../components/Signup';
import Login from '../components/Login';
import User from '../components/User';
import Image from '../components/Image';

const Router = () => (
    <div style={{position: 'relative', top: '10px'}}>
        <Route exact path="/" component={App} />
        <Route exact path="/upload" component={Form} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/user/:username" component={User} />
        <Route exact path="/user/:username/:page" component={User} />
        <Route exact path="/image/:id" component={Image} />
    </div>
);

//TODO
/*
    <ProtectedRoute exact path="/upload" component={Form} />
    <Route exact path="/user/:username" component={User} />*/

export default Router;