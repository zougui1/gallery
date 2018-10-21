import React from 'react';

import { getPosition } from '../../../utils/';
import { emit } from '../../../socket/upload';

import Swatches from './Swatches';
import Canvas from './Canvas';


class Overlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '0px',
            height: '0px',
            inputKey: 0,
            current: {
                color: 'rgba(0,0,0,1)',
                eraseSize: 10,
                displayMainLayer: true,
                displayInputs: true
            },
            inputs: [],
            labels: [],
            contextAction: 'draw',
            images: {},
            hasTextCanvas: true
        }

        this.imgRef = React.createRef();
        this.canvas = null;
    }

    componentDidMount = () => {
        this.setSize();
        const positions = getPosition(this.imgRef.current);
        this.setState({
            context: this.canvas.getContext('2d'),
            canvasPositions: positions
        });
        this.canvas.style.top = positions.top + 'px';
        this.canvas.style.left = positions.left + 'px';
    }

    componentDidUpdate = () => {
        const { images, hasTextCanvas } = this.state;
        console.log(hasTextCanvas)
        let tempArr = [];
        for (const key in images) {
            if (images[key]) {
                tempArr.push(1);
                console.log(tempArr.length)
            }
        }
        if(tempArr.length === 3 && hasTextCanvas)
            emit.uploadImage(images);
        else if(tempArr.length === 2 && !hasTextCanvas)
            emit.uploadImage(images);
    }

    setSize = () => {
        const img = this.imgRef.current;
        
        img.addEventListener('load', () => {
            const height = img.offsetHeight;
            const width = img.offsetWidth;
            this.setState({ width: width, height: height });
        })
    }

    onCreateInput = e => {
        let { inputKey, current, labels } = this.state;
        labels.push(React.createRef());
        this.setState({ labels });
        let label;
        const element = (
            <label key={inputKey} data-key={inputKey} htmlFor={'input-' + inputKey} ref={labels[inputKey]} style={{top: e.clientY, left: e.clientX, color: current.color}} className="canvas-label" onClick={this.onInputClick}>
                Input
                <input id={'input-' + inputKey} data-key={inputKey} className="canvas-input" />
            </label>
        );
        const input = {
            element,
            inputKey,
            label: this.state.labels[inputKey]
        };
        inputKey++;
        const inputs = this.state.inputs.concat(input);
        this.setState({inputs, inputKey});
    }

    setRef = ref => this.canvas = ref;

    _setState = (value, name) => {
        if(name) this.setState({ [name]: value });
        else this.setState({ [value]: value });
    }
    
    eraseChangeHandler = e => {
        if(e.target.checked) this.setState({ contextAction: 'erase' })
        else this.setState({ contextAction: 'draw' });
    }

    render() {
      const {
          onAlphaEdit,
          onCreateInput,
          setImageTemp,
          setRef,
          _setState,
          imgRef,
          eraseChangeHandler,
          canvas
        } = this;
      const { imageTemp } = this.props;
      const {
          width,
          height,
          current,
          canvasPositions,
          context,
          contextAction,
          lastFocused,
          images
      } = this.state;
      const canvasActions = {
          onCreateInput,
          setRef,
          _setState
      }
      const canvasDatas = {
          canvasPositions,
          width,
          height,
          current,
          context,
          contextAction,
          canvas,
          imgRef
      }
      const swatchesActions = {
          onAlphaEdit,
          _setState,
          eraseChangeHandler
      }
      const size = {
          width,
          height
      }
      const overlayContainer = document.getElementsByClassName('overlay-container')[0];

        return (
            <div className="overlay-container">
                <Canvas images={images} actions={canvasActions} canvasDatas={canvasDatas} />
                <img onLoad={setImageTemp} className="draw-on" ref={imgRef} src={imageTemp} alt=""/>
                
                <Swatches
                    overlayContainer={overlayContainer}
                    size={size}
                    context={context}
                    current={current}
                    actions={swatchesActions}
                    lastFocused={lastFocused}
                />
            </div>
        );
    }
}

export default Overlay;