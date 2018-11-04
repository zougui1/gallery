import { gallery } from '../action-type';
import { gallery as galleryActions } from '../actions';
import { emit, on } from '../../socket/user';

const {
    SET_FILTER,
    SET_CURRENT_PAGE,
} = gallery;

const {
    setImages
} = galleryActions;

export const getImageByTag = store => next => action => {
    switch (action.type) {
        case SET_FILTER:
            /*emit.getImagesByUserAndTags({
                username: store.getState().authReducer.loggedUsername,
                tags: action.payload
            });*/
            return next(action)
    
        default: return next(action);
    }
}

export const getImagesByCurrentPage = store => next => action => {
    switch (action.type) {
        case SET_CURRENT_PAGE:
            setTimeout(() => {
                const { galleryReducer } = store.getState();
                const req = {
                    username: galleryReducer.currentUser,
                    page: galleryReducer.currentPage,
                };
                emit.retrieveImagesByUser(req);
                on.retrieveImagesFromDB(images => {
                    store.dispatch(setImages(images));
                })
            }, 1500);
            return next(action);
    
        default: return next(action);
    }
}