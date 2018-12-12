import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { mapDynamicState } from '../../utils';

const mapStateToProps = mapDynamicState('loggedUsername', 'auth');

export class index extends Component {

  render() {
    const { loggedUsername } = this.props;

    return (
      <div>
        <AppBar position="static" style={{backgroundColor: '#2196f3'}}>
            <ToolBar>
                <Typography variant="h6" color="inherit">
                    <Link style={{color: '#fff'}} to="/">Dorg gallery</Link>
                </Typography>
                <div style={{position: 'absolute', right: '10px'}}>
                  {
                    loggedUsername
                    ? (
                        <Button>
                          <Link style={{color: '#fff'}} to="/upload">Upload an image</Link>
                        </Button>
                      )
                    : ''
                  }
                  <Button>
                    {
                      loggedUsername
                      ? <Link style={{color: '#fff'}} to={`/user/${loggedUsername}`}>{loggedUsername}</Link>
                      : <Link style={{color: '#fff'}} to={'/login'}>Login</Link>
                    }
                  </Button>
                </div>
            </ToolBar>
        </AppBar>
      </div>
    )
  }
}

export default connect(mapStateToProps)(index);
