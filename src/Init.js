import React from 'react'
import { connect } from 'react-redux'

import { mapDynamicState } from './utils';
import { auth } from './store/actions';

const {
    login,
} = auth;


const mapStateToProps = mapDynamicState('loggedUsername', 'auth');
const mapDispatchToProps = (dispatch) => ({
  login: (username) => dispatch(login(username)),
});

export class Init extends React.Component {
  constructor(props) {
    super(props);
    const { loggedUsername, login } = this.props;
    const username = window.localStorage.getItem('username');
    if(username && !loggedUsername) login(username);
  }

  render() {
    return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Init);
