import { combineReducers } from 'redux';

import initReducer from './init';
import uploaderReducer from './uploader';
import galleryReducer from './gallery';
import authReducer from './auth';

const rootReducer = combineReducers({
    initReducer,
    uploaderReducer,
    galleryReducer,
    authReducer,
});

export default rootReducer;