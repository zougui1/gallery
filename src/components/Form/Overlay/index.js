import React from 'react';
import { connect } from 'react-redux';

import { getPosition } from '../../../utils/';
import { emit } from '../../../socket/upload';
import { uploader } from '../../../store/actions/';
import { mapDynamicState } from '../../../utils';

import Swatches from './Swatches';
import Canvas from './Canvas';

const {
    changeImageData,
    changeCurrentCanvasData,
} = uploader;

const mapStateToProps = mapDynamicState('imageData canvasSize currentCanvasData imagesToUpload', 'uploader');
const mapDispatchToProps = dispatch => ({ 
  changeImageData: canvasSize => dispatch(changeImageData(canvasSize)),
  changeCurrentCanvasData: contextAction => dispatch(changeCurrentCanvasData(contextAction)),
 });
class Overlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        this.imgRef = React.createRef();
        this.canvas = null;
    }

    componentDidMount = () => {
        this.props.changeCurrentCanvasData({
            ...this.props.currentCanvasData,
            context: this.canvas.getContext('2d'),
        });
        this.setSize();
        const positions = getPosition(this.imgRef.current);
        this.setState({ canvasPositions: positions });
        this.canvas.style.top = positions.top + 'px';
        this.canvas.style.left = positions.left + 'px';
    }

    componentDidUpdate = () => {
        const { imagesToUpload, hasTextCanvas } = this.props;
        let tempArr = [];
        for (const key in imagesToUpload) {
            if (imagesToUpload[key]) {
                tempArr.push(1);
            }
        }
        if((tempArr.length === 3 && hasTextCanvas) || (tempArr.length === 2 && !hasTextCanvas)) {
            const { imageData } = this.props;
            const imageDataWithCanvas = {...imageData, ...imagesToUpload};
            console.log('upload')
            emit.uploadImage(imageDataWithCanvas);
        }
    }

    setSize = () => {
        const img = this.imgRef.current;
        
        img.addEventListener('load', () => {
            const height = img.offsetHeight;
            const width = img.offsetWidth;
            this.props.changeImageData({
                ...this.props.imageData,
                width,
                height
            });
        })
    }

    onCreateInput = e => {
        let { inputKey, labels } = this.state;
        let { currentCanvasData } = this.props;
        labels.push(React.createRef());
        this.setState({ labels });
        let label;
        const element = (
            <label key={inputKey} data-key={inputKey} htmlFor={'input-' + inputKey} ref={labels[inputKey]} style={{top: e.clientY, left: e.clientX, color: currentCanvasData.color}} className="canvas-label" onClick={this.onInputClick}>
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
        this.setState({ inputs, inputKey });
    }

    setRef = ref => this.canvas = ref;
    
    eraseChangeHandler = checked => {
        if(checked) this.props.changeCurrentCanvasData({
            ...this.props.currentCanvasData,
            contextAction: 'erase',
        });
        else this.props.changeCurrentCanvasData({
            ...this.props.currentCanvasData,
            contextAction: 'draw',
        });
    }

    render() {
      const {
          setRef,
          imgRef,
          eraseChangeHandler,
          canvas
        } = this;
      const { imageData, } = this.props;
      const {
          canvasPositions,
          lastFocused,
      } = this.state;
      const canvasDatas = {
          canvasPositions,
          canvas,
          imgRef
      }
      const overlayContainer = document.getElementsByClassName('overlay-container')[0];

        return (
            <div className="overlay-container">
                <Canvas setRef={setRef} canvasDatas={canvasDatas} />
                <img className="draw-on" ref={imgRef} src={imageData.imageTemp64} alt=""/>
                
                <Swatches
                    overlayContainer={overlayContainer}
                    eraseChangeHandler={eraseChangeHandler}
                    lastFocused={lastFocused}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overlay);