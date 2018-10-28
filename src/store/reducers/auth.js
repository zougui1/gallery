import { auth } from '../action-type';

const {
    LOGIN,
} = auth;

const authState = {
    loggedUsername: '',
};

const authReducer = (state = authState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                loggedUsername: action.payload
            };
    
        default: return { ...state };
    }
}

export default authReducer;