import { gallery } from '../action-type';
import { inArray } from '../../utils';

const {
    SHOW_OVERLAY_ON_IMAGES,
    SET_IMAGES,
    SET_FILTERED_IMAGES,
    SET_FILTER,
} = gallery;

export const displayOverlay = showOverlay => ({ type: SHOW_OVERLAY_ON_IMAGES, payload: showOverlay });
export const setImages = images => ({ type: SET_IMAGES, payload: images });
export const setFilteredImages = images => ({ type: SET_FILTERED_IMAGES, payload: images });
export const setFilter = filter => ({ type: SET_FILTER, payload: filter });

const filter2Arrays = (arr1, arr2, returnBool) => {
    const tempArr = arr1.filter(elm => inArray(elm, arr2));

    if(returnBool) return tempArr.length === arr2.length;
    return tempArr
}

const filterImages = state => {
    const { images, filter } = state.galleryReducer;
    return images.filter(image => {
        const filteredTags = filter2Arrays(image.tags, filter);
        return filter2Arrays(filteredTags, filter, true);
    });
}

export const getFilteredImages = state => filterImages(state);