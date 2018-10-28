//import { createStore, applyMiddleware, compose } from 'redux';
import { createStore } from 'redux';

import rootReducer from './reducers';
import defaultState from './defaultState';
import _init from './init';


//const appliedMiddleware = applyMiddleware(filterImages);

const devTools = [];
if(window.devToolsExtension) {
    devTools.push(window.devToolsExtension());
}

//const enhancers = compose(appliedMiddleware, ...devTools);

const store = createStore(rootReducer, defaultState, ...devTools);

_init.init();

export default store;