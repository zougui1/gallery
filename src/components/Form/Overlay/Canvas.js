import React from 'react';
import uploadcare from 'uploadcare-widget'
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import '../form.scss';

import { emit } from '../../../socket/upload';
import { b64ToBlob } from '../../../utils';
import { mapDynamicState } from '../../../utils';
import { uploader } from '../../../store/actions';

import CanvasField from './CanvasField';

const {
    changeCurrentCanvasData,
    addImageToUpload,
    addCanvasField,
    addCanvasLabel,
    editCanvasField,
    setCanvasField,
} = uploader;

const mapStateToProps = mapDynamicState('currentCanvasData imageData imagesToUpload inputs labels', 'uploader');
const mapDispatchToProps = dispatch => ({ 
  addCanvasField: field => dispatch(addCanvasField(field)),
  addCanvasLabel: label => dispatch(addCanvasLabel(label)),
  addImageToUpload: image => dispatch(addImageToUpload(image)),
  changeCurrentCanvasData: contextAction => dispatch(changeCurrentCanvasData(contextAction)),
  editCanvasField: (field, id) => dispatch(editCanvasField(field, id)),
  setCanvasField: field => dispatch(setCanvasField(field)),
 });
class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputKey: 0,
        }
    }

    componentDidMount = () => {
        this.props.setRef(document.getElementById('canvas'));
        const htmlElement = document.getElementsByTagName('html')[0];
        htmlElement.addEventListener('dragover', e => this.dragOverHandler(e, 'html'));
        htmlElement.addEventListener('drop', this.dropHandler);
        htmlElement.style.overflow = 'hidden';
    }

    drawLine = (x0, y0, x1, y1, color) => {
        const { canvasPositions } = this.props.canvasDatas;
        const { context, contextAction } = this.props.currentCanvasData;
        const current = this.props.currentCanvasData;
        const { top, left } = canvasPositions;
        x0 -= left;
        y0 -= top;

        if(contextAction === 'draw') {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1 - left, y1 - top);
            context.strokeStyle = color;
            context.lineWidth = 3;
            context.stroke();
            context.closePath();
        } else if(contextAction === 'erase') {
            const eraseSize = current.eraseSize;
            x0 = x0 - (eraseSize / 2);
            y0 = y0 - (eraseSize / 2);
            context.clearRect(x0, y0, eraseSize, eraseSize);
        }
    }

    mouseDownHandler = e => {
        const current = this.props.currentCanvasData;

        current.x = e.clientX;
        current.y = e.clientY;
        current.drawing = true;
        changeCurrentCanvasData(current)
    }

    mouseUpHandler = e => {
        const current = this.props.currentCanvasData;
        const { drawing } = current;

        if (!drawing) {return};
        changeCurrentCanvasData(current.drawing = false)
        this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    }

    mouseMoveHandler = e => {
        const current = this.props.currentCanvasData;
        const { drawing } = current;

        if (!drawing) {return};
        this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
        current.x = e.clientX;
        current.y = e.clientY;
        changeCurrentCanvasData(current)
    }

    throttle = (callback, delay) => {
        let previousCall = new Date().getTime();
        return function() {
            let time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    onCreateInput = e => {
        let { inputKey } = this.state;
        let { inputs, canvasDatas } = this.props;
        let current = this.props.currentCanvasData;
        const { top, left } = canvasDatas.canvasPositions;
        
        const client = {x: e.clientX - left, y: e.clientY - top}
        this.props.labels[inputKey] = React.createRef();
        this.props.addCanvasLabel(this.props.labels);
        const element2 = (
            <CanvasField
                key={inputKey}
                _key={inputKey}
                client={client}
                current={current} />
        );

        const input = {
            element: element2,
            inputKey,
            label: this.props.labels[inputKey]
        };
        inputKey++;
        inputs = this.props.inputs.concat(input);
        this.props.addCanvasField(inputs);
        this.setState({ inputKey, lastInput: input })
    }

    dragOverHandler = (e, type) => {
        e.preventDefault();
        if(type !== 'html') {
            this.props.changeCurrentCanvasData({ ...this.props.currentCanvasData, draggingOut: false })
        };
    }

    dragLeaveHandler = () => {
        this.props.changeCurrentCanvasData({ ...this.props.currentCanvasData, draggingOut: true });
    }

    dropHandler = e => {
        let { inputs } = this.props;
        const key = Number(e.dataTransfer.getData('key'));
        let inputsUpdate;

        if(!this.props.currentCanvasData.draggingOut) {
            inputs.forEach(input => {
                if(input.inputKey === key) {
                    let currentLabel = input.label.current;
                    currentLabel.style.top = e.clientY + 'px';
                    currentLabel.style.left = e.clientX + 'px';
                    this.props.editCanvasField(input, key);
                }
            });
        } else {
            inputsUpdate = inputs.filter(input => {
                if(input.inputKey !== key) {return input};
            })
            this.props.setCanvasField(inputsUpdate);
        }
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

    createTextCanvas = () => {
        const { width, height } = this.props.imageData;
        const { inputs } = this.props;
        
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        if(inputs.length > 0) {
            inputs.forEach(label => {
                label = label.label.current;
                const style = label.style;
                const input = label.childNodes[1];
                let fontSize = input.style.fontSize.replace('px', '');
                fontSize = Number(fontSize) + 3 + 'px';
                const left = Number(style.left.replace('px', ''));
                const top = Number(style.top.replace('px', ''));

                context.fillStyle = style.color;
                context.font = fontSize + ' sans-serif';
                context.fillText(input.value, left, top);
            });
            return canvas;
        }
    }

    render() {
        const { imageData } = this.props;
        const {
            mouseDownHandler,
            mouseUpHandler,
            mouseMoveHandler,
            throttle,
            onCreateInput,
            dragOverHandler,
            dragLeaveHandler,
            uploadHandler
        } = this;
        const { width, height } = imageData;
        console.log(width, height)

        const inputsElement = this.props.inputs.map(input => input.element);

        return (
            <div>
                <div style={{userSelect: 'none'}} className="canvas-container" onDragLeave={dragLeaveHandler} onDragOver={dragOverHandler}>
                    <canvas
                        style={{userSelect: 'none'}}
                        className="canvas droppable"
                        id="canvas"
                        width={width}
                        height={height}
                        onMouseDown={mouseDownHandler}
                        onMouseUp={mouseUpHandler}
                        onMouseMove={throttle(mouseMoveHandler, 10)}
                        onDoubleClick={onCreateInput}
                    ></canvas>
                    {inputsElement}
                </div>
                <Button variant="contained" color="primary" style={{userSelect: 'none', position: 'absolute', bottom: '-89.5vh', fontWeight: 'bold', marginLeft: '10px'}} onClick={uploadHandler}>Upload</Button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);