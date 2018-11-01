import { createStore, applyMiddleware, compose } from 'redux';
//import { createStore } from 'redux';

import rootReducer from './reducers';
import defaultState from './defaultState';
import _init from './init';
import { getImageByTag, getImagesByCurrentPage } from './middlewares';


const appliedMiddleware = applyMiddleware(getImageByTag, getImagesByCurrentPage);

const devTools = [];
if(window.devToolsExtension) {
    devTools.push(window.devToolsExtension());
}


const enhancers = compose(appliedMiddleware, ...devTools);

const store = createStore(rootReducer, defaultState, enhancers);

_init.init();

export default store;