import { emit, on } from '../socket/upload';
import { init } from './actions';
import store from './';

const {
    setTagsList,
} = init;

const _init = {
    init: () => {
        _init.setTagsList();
    },

    setTagsList: () => {
        emit.getAllTags();
        on.retrieveAllTagsFromDB(tags => {
            const tagsList = tags.map(tag => ({value: tag.name, label: tag.name}));
            store.dispatch(setTagsList(tagsList));
        });
    },
}

export default _init;