import React from 'react';

import Uploader from './Uploader';
import Overlay from './Overlay';

import './form.scss';


class Form extends React.Component {

    state = {
        inputFile: React.createRef(),
        view: 'Uploader'
    }    

    addImageTemp = object => {
        this.setState(object);
        this.setImageSize();
    }

    setImageSize = () => {
        const imageTemp = this.state.imageTemp;
        if (imageTemp !== undefined) {
            const height = imageTemp.offsetHeight;
            const width = imageTemp.offsetWidth;
            this.setState({ width, height });
        }
    }

    getImageSize = () => ({ width: this.state.width, height: this.state.height });

    setView = view => this.setState({ view });

    render() {
        const { setView, addImageTemp } = this;
        const { imageTemp64, view } = this.state;

        return (
            <div>
                { view === 'Uploader' && Uploader
                    ? <Uploader setView={setView} addImageTemp={addImageTemp} />
                    : ''}
                { view === 'Overlay' && Overlay
                    ? <Overlay imageTemp={imageTemp64} addImageTemp={addImageTemp} />
                    : ''}
            </div>
        );
    }
    
}

export default Form;