import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../components/Home';
import Form from '../components/Form';
import Signup from '../components/Signup';
import Login from '../components/Login';
import User from '../components/User';
import Image from '../components/Image';
import NotFound from '../components/NotFound';

const Router = () => (
    <div style={{position: 'relative', top: '10px'}}>
        <Switch>
            <Route exact path="/" component={Home} />
            <ProtectedRoute exact path="/upload" component={Form} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/user/:username" component={User} />
            <Route exact path="/user/:username/:page" component={User} />
            <Route exact path="/image/:id" component={Image} />
            <Route exact component={NotFound} />
        </Switch>
    </div>
);

export default Router;
