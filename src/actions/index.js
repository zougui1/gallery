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
} from '../constants/action-types';

export const changeFormView = viewName => ({ type: CHANGE_FORM_VIEW, payload: viewName });
export const changeImageData = imageData => ({ type: CHANGE_IMAGE_DATA, payload: imageData });
export const changeCurrentCanvasData = currentCanvasData => ({ type: CHANGE_CURRENT_CANVAS_DATA, payload: currentCanvasData });
export const addImageToUpload = image => ({ type: ADD_IMAGE_TO_UPLOAD, payload: image });
export const addCanvasField = field => ({ type: ADD_CANVAS_FIELD, payload: field });
export const editCanvasField = (field, id) => ({ type: EDIT_CANVAS_FIELD, payload: { element: field, id: id } });
export const setCanvasField = fields => ({ type: ADD_CANVAS_FIELD, payload: fields });
export const addCanvasLabel = label => ({ type: ADD_CANVAS_LABEL, payload: label });
export const editCanvasLabel = (label, id) => ({ type: EDIT_CANVAS_LABEL, payload: { element: label, id: id } });
window.changeFormView = changeFormView;