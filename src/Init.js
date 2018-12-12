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
    /*const { loggedUsername, login } = this.props;
    const username = window.localStorage.getItem('username');
    if(username && !loggedUsername) login(username);*/
    // retrieve each element that has "temp" as class
    const temps = document.getElementsByClassName('temp');
    for (let i = 0; i < temps.length; i++) {
      const current = temps[i];
      // if the current element has the class "remove", then we want to delete it
      if(current.classList.contains('remove')) current.outerHTML = '';
    }
    setTimeout(() => {
      window.UPLOADCARE_PUBLIC_KEY = null;
      window.UPLOADCARE_LOCALE = null;
    }, 500); // we need to let some time to uploadcare to store these info, 100ms is enough
  }

  render() {
    return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Init);
