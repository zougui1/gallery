import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import uploadcare from 'uploadcare-widget'

import { getPosition } from '../../../utils/';
import { emit } from '../../../socket/upload';
import { uploader } from '../../../store/actions/';
import { mapDynamicState, b64ToBlob } from '../../../utils';

import Swatches from './Swatches';
import Canvas from './Canvas';
import CanvasHelper from '../../CanvasHelper';

const {
    changeImageData,
    changeCurrentCanvasData,
    addImageToUpload,
} = uploader;

const mapStateToProps = mapDynamicState('imageData canvasSize currentCanvasData imagesToUpload inputs', 'uploader');
const mapDispatchToProps = dispatch => ({ 
  addImageToUpload: image => dispatch(addImageToUpload(image)),
  changeImageData: canvasSize => dispatch(changeImageData(canvasSize)),
  changeCurrentCanvasData: contextAction => dispatch(changeCurrentCanvasData(contextAction)),
 });
class Overlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
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
        const htmlElement = document.getElementsByTagName('html')[0];
        htmlElement.addEventListener('click', this.handleModalClose);
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

    /**
     * @var {Array} inputs
     * @var {Object} input
     * @var {Object} input.element-
     * @var {Number} input.inputKey
     * @var {Object} input.label
     * @var {HTMLLabelElement} input.label.current
     */
    uploadHandler = () => {
        const { canvas, imgRef } = this.props.canvasDatas;
        const textCanvas = this.createTextCanvas();
        this.uploader(b64ToBlob(imgRef.current.src), 'image');
        canvas.toBlob(blob => this.uploader(blob, 'draw'));

        if(textCanvas) {
            textCanvas.toBlob(blob => this.uploader(blob, 'text'));
        }
        else {
            this.props.changeCurrentCanvasData({ ...this.props.currentCanvasData, hasTextCanvas: false });
        }
    }

    uploader = (image, type) => {
        const fileUp = uploadcare.fileFrom('object', image);
        
        fileUp.done(file => {
            let { imagesToUpload, addImageToUpload } = this.props;
            console.log(file)
            
            imagesToUpload[type] = file.uuid + '/original';
            addImageToUpload({ ...imagesToUpload, imagesToUpload, });
            this.uploadToMongo();
        });
    }

    uploadToMongo = () => {
        const { imagesToUpload, currentCanvasData } = this.props;
        const { hasTextCanvas } = currentCanvasData
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

    handleModalClose = () => {
        this.setState({ modalOpen: false });
    };

    handleModalOpen = () => {
        this.setState({ modalOpen: true });
    };

    render() {
      const {
          setRef,
          imgRef,
          eraseChangeHandler,
          canvas,
          uploadHandler,
          handleModalOpen,
          handleModalClose,
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
                {this.imgRef.current && console.log(this)}
                {this.imgRef.current && console.log(this.imgRef.current.offsetHeight + 80 + 'px')}
                <Canvas canvasDatas={canvasDatas} setRef={setRef} />
                <img className="draw-on" ref={imgRef} src={imageData.imageTemp64} alt=""/>
                
                <Swatches
                    canvasDatas={canvasDatas}
                    overlayContainer={overlayContainer}
                    eraseChangeHandler={eraseChangeHandler}
                    lastFocused={lastFocused}
                    handleModalOpen={handleModalOpen}
                />

                {
                    this.imgRef.current
                    ? <Button variant="contained" color="primary" style={{userSelect: 'none', position: 'absolute', top: this.imgRef.current.offsetHeight + 20 + 'px', fontWeight: 'bold', marginLeft: '10px'}} onClick={uploadHandler}>Upload</Button>
                    : <Button variant="contained" color="primary" style={{userSelect: 'none', position: 'absolute', bottom: 'calc(-89.5vh)', fontWeight: 'bold', marginLeft: '10px'}} onClick={uploadHandler}>Upload</Button>
                }
                <CanvasHelper open={this.state.modalOpen} onClose={handleModalClose} />
            </div>
        );
    }
}
//imagesToUpload inputs
export default connect(mapStateToProps, mapDispatchToProps)(Overlay);