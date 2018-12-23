import { gallery } from '../action-type';

const {
    SHOW_OVERLAY_ON_IMAGES,
    SET_IMAGES,
    SET_FILTERED_IMAGES,
    SET_FILTER,
    SET_CURRENT_PAGE,
    SET_CURRENT_USER,
    SET_REQUEST_RECEIVED,
} = gallery;

const galleryState = {
    showOverlay: {
        all: true,
        draw: true,
        text: true,
    },
    images: [],
    filteredImages: [],
    filter: ['everything'],
    currentPage: 1,
    currentUser: '',
    requestReceived: false,
};

const galleryReducer = (state = galleryState, action) => {
    switch (action.type) {
        case SHOW_OVERLAY_ON_IMAGES:
            return {
                ...state,
                showOverlay: action.payload
            };
        case SET_IMAGES:
            return {
                ...state,
                images: action.payload
            };
        case SET_FILTERED_IMAGES:
            return {
                ...state,
                filteredImages: action.payload
            };
        case SET_FILTER:
            return {
                ...state,
                filter: action.payload
            };
        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.payload
            };
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            };
        case SET_REQUEST_RECEIVED:
            return {
                ...state,
                requestReceived: action.payload
            };

        default: return { ...state };
    }

};

export default galleryReducer;
