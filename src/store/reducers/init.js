import { init } from '../action-type';

const {
    SET_TAGS_LIST,
} = init;

const initState = {
    tagsList: [],
};

const initReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_TAGS_LIST:
            return {
                ...state,
                tagsList: action.payload
            };
    
        default: return { ...state };
    }
};

export default initReducer;