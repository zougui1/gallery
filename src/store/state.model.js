/*
 * This code is useless, this is just a model of the redux state, saying what's in there
 */

const stateModel = {
    initState: {
        tagsList: [String], // tags list used for the auto-completion with the ChipsInput
    },

    uploaderState: {
        view: String, // relate to a component
        imageData: {
            artistName: String, // the name of the artist who drew the uploaded image
            artistLink: String, // the link where we can find the say artist's arts
            characterName: String, // the name of the character drawed
            username: String, // the name of the current user logged
            tags: [String], // the tags selected by the user
            isNsfw: Boolean, // obviously say if the image is nsfw or not
            imageTemp64: String, // a base64 string of the image choosen by the user, used only if the user wanna draw an overlay
            width: Number, // width of the image uploaded
            height: Number, // height of the image uploaded
        },
        currentCanvasData: {
            color: String, // the current color used to draw/write, format: rgba
            eraseSize: Number, // the current size of the eraser
            fontSize: Number, // the current size of the font
            displayMainLayer: Boolean, // show/hide the main layer (where the user draw)
            displayInputs: Boolean, // show/hide the inputs
            alpha: Number, // the current color's alpha
            contextAction: String, // either 'draw' or 'erase' is the current action for the canvas's context
            drawing: Boolean, // say if it should draw or not
            context: CanvasRenderingContext2D, // the canvas's rendering context 2D if it wasn't obvious ¯\_(ツ)_/¯
            hasTextCanvas: Boolean, // say if there is a text canvas
            draggingOut: Boolean, // say if an input is dragging out of the canvas
            x: Number, // the current position x of the user
            y: Number, // the current position y of the user
        },
        imagesToUpload: {
            image: Blob, // the blob of the image uploaded by the user
            draw: Blob, // the blob of the draw canvas
            text: Blob, // the blob of the text canvas (if existing)
        },
        inputs: [{
            element: Object, // react ref element (input)
            label: {
                current: HTMLLabelElement, // HTMLLabelElement, contains an input and a span (containing the text 'input')
            },
            inputKey: Number, // the input's id
        }],
        labels: [
            Object, // react ref element (label)
        ],
    },

    galleryState: {
        showOverlay: {
            all: Boolean, // show/hide all overlay
            draw: Boolean, // show hide the draw overlay
            text: Boolean, // show hide the text overlay
        },
        images: [{
            image: String, // the uuid of the image
            canvas: {
                draw: String, // the uuid of the draw overlay
                text: String, // the uuid of the text overlay
            },
            tags: [String], // the image's tags
            username: String, // the username who uploaded the image
        }],
        filter: [String], // the tags used to filter the images
    },


    authState: {
        loggedUsername: String, // the name of the logged user
    },
}