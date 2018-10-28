import { init } from '../action-type';

const {
    SET_TAGS_LIST,
} = init;

export const setTagsList = tagsList => ({ type: SET_TAGS_LIST, payload: tagsList });
