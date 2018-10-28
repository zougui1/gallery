import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapDynamicState } from '../../utils/';

const mapStateToProps = mapDynamicState('loggedUsername', 'auth');
const ProtectedRoute = ({ component: Component, loggedUsername, ...rest }) => (
    <Route {...rest} render={props => (
        loggedUsername || localStorage.getItem('username')
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);

export default connect(mapStateToProps)(ProtectedRoute);