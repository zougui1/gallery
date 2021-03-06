import React from 'react';
import ReactDOM from 'react-dom';
//import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import store from "./store";
import Navbar from './components/Navbar';
import Router from './Router';
import Init from './Init';
import socket from './socket/config';

class Root extends React.Component {

    componentWillUnmount = () => {
      socket.emit('disconnect');
    }
    

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div>
                        <Init />
                        <Navbar />
                        <Router />
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
