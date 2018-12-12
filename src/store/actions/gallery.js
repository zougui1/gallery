import { gallery } from '../action-type';

const {
    SHOW_OVERLAY_ON_IMAGES,
    SET_IMAGES,
    SET_FILTERED_IMAGES,
    SET_FILTER,
    SET_CURRENT_PAGE,
    SET_CURRENT_USER,
} = gallery;

export const displayOverlay = showOverlay => ({ type: SHOW_OVERLAY_ON_IMAGES, payload: showOverlay });
export const setImages = images => ({ type: SET_IMAGES, payload: images });
export const setFilteredImages = images => ({ type: SET_FILTERED_IMAGES, payload: images });
export const setFilter = filter => ({ type: SET_FILTER, payload: filter });
export const setCurrentPage = currentPage => ({ type: SET_CURRENT_PAGE, payload: currentPage });
export const setCurrentUser = currentUser => ({ type: SET_CURRENT_USER, payload: currentUser });

export const getFilteredImages = state => state.galleryReducer.images;
