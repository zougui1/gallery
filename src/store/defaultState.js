const initState = {
    tagsList: [],
};

const uploaderState = {
    view: 'Uploader',
    imageData: {},
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
};

const galleryState = {
    showOverlay: {
        all: true,
        draw: true,
        text: true,
    },
    images: [],
    filteredImages: [],
    filter: ['everything'],
};


const authState = {
    loggedUsername: '',
};

const defaultState = {
    ...initState,
    ...uploaderState,
    ...galleryState,
    ...authState,
}

export default defaultState;