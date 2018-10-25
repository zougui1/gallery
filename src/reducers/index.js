import {
    CHANGE_FORM_VIEW,
    CHANGE_IMAGE_DATA,
    CHANGE_CURRENT_CANVAS_DATA,
    ADD_IMAGE_TO_UPLOAD,
    ADD_CANVAS_FIELD,
    EDIT_CANVAS_FIELD,
    SET_CANVAS_FIELD,
    ADD_CANVAS_LABEL,
    EDIT_CANVAS_LABEL,
    LOGIN,
} from '../constants/action-types';

const initialState = {
    view: 'Uploader',
    imageData: null,
    currentCanvasData: {
        color: 'rgba(0,0,0,1)',
        eraseSize: 10,
        fontSize: 16,
        displayMainLayer: true,
        displayInputs: true,
        alpha: 1,
        contextAction: 'draw',
        drawing: false,
        context: null,
        hasTextCanvas: true,
        draggingOut: false,
    },
    imagesToUpload: {},
    inputs: [],
    labels: [],
    loggedUsername: '',
};

const rootReducer = (state = initialState, action) => {
        switch (action.type) {
            case CHANGE_FORM_VIEW:
                return {
                    ...state,
                    view: action.payload
                };
            case CHANGE_IMAGE_DATA:
                return {
                    ...state,
                    imageData: action.payload
                };
            case CHANGE_CURRENT_CANVAS_DATA:
                return {
                    ...state,
                    currentCanvasData: action.payload
                };
            case ADD_IMAGE_TO_UPLOAD:
                return {
                    ...state,
                    images: action.payload
                };
            case ADD_CANVAS_FIELD:
                return {
                    ...state,
                    inputs: action.payload
                };
            case EDIT_CANVAS_FIELD:
                const updatedInputs = state.inputs.map(input => {
                    if(input.inputKey == action.payload.id) input = action.payload.element;
                    return input;
                })
                return {
                    ...state,
                    labels: updatedInputs
                };
            case SET_CANVAS_FIELD:
                return {
                    ...state,
                    inputs: action.payload
                };
            case ADD_CANVAS_LABEL:
                return {
                    ...state,
                    labels: action.payload
                };
            case EDIT_CANVAS_LABEL:
                const updatedLabels = state.labels.map((label, i) => {
                    if(i == action.payload.id) label.current = action.payload.element;
                    return label;
                })
                return {
                    ...state,
                    labels: updatedLabels
                };
            case LOGIN:
                console.log(action)
                return {
                    ...state,
                    loggedUsername: action.payload
                };
    
        default:
            return state;
    }
};

export default rootReducer;