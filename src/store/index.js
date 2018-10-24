import { createStore } from 'redux';
import rootReducer from '../reducers/';

const store = createStore(rootReducer);
//store.subscribe(() => console.log(store.getState()))

window.store = store;

export default store;