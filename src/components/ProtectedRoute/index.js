import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapDynamicState } from '../../utils/';

const mapStateToProps = mapDynamicState('loggedUsername', 'auth');
const ProtectedRoute = ({ component: Component, loggedUsername, ...rest }) => (
    <Route {...rest} render={props => (
        loggedUsername
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);

export default withRouter(connect(mapStateToProps)(ProtectedRoute));
