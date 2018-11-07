import React from 'react';
import { connect } from 'react-redux';

import '../form.scss';

import { emit } from '../../../socket/upload';
import { mapDynamicState } from '../../../utils';
import { uploader } from '../../../store/actions';


const {
    changeCurrentCanvasData,
    setCanvasField,
    editCanvasField,
} = uploader;

const mapStateToProps = mapDynamicState('currentCanvasData imageData inputs', 'uploader');
const mapDispatchToProps = dispatch => ({ 
  changeCurrentCanvasData: contextAction => dispatch(changeCurrentCanvasData(contextAction)),
  setCanvasField: field => dispatch(setCanvasField(field)),
  editCanvasField: (field, id) => dispatch(editCanvasField(field, id)),
 });
class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputKey: 0,
            circleSize: 10,
            lineSize: 3,
        }
    }

    componentDidMount = () => {
        this.props.setRef(document.getElementById('canvas'));
        const htmlElement = document.getElementsByTagName('html')[0];
        htmlElement.addEventListener('dragover', e => this.dragOverHandler(e, 'html'));
        htmlElement.addEventListener('drop', this.dropHandler);
        window.setCircleSize = circleSize => this.props.changeCurrentCanvasData({...this.props.currentCanvasData, strokeSize: circleSize});
        window.setLineSize = lineSize => this.setState({lineSize});
        window.putImageData = (alpha, dx, dy,
            dirtyX, dirtyY, dirtyWidth, dirtyHeight) => {
            var ctx = this.props.currentCanvasData.context;
            ctx.globalAlpha = alpha;
            console.log(ctx.globalAlpha)
            var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            var data = imageData.data;
            var height = imageData.height;
            var width = imageData.width;
            dx = dx || 0;
            dy = dy || 0;
            dirtyX = dirtyX || 0;
            dirtyY = dirtyY || 0;
            dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
            dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;
            var limitBottom = Math.min(dirtyHeight, height);
            var limitRight = Math.min(dirtyWidth, width);
            for (var y = dirtyY; y < limitBottom; y++) {
                for (var x = dirtyX; x < limitRight; x++) {
                    var pos = y * width + x;
                    ctx.fillStyle = 'rgba(' + data[pos * 4 + 0] +
                        ',' + data[pos * 4 + 1] +
                        ',' + data[pos * 4 + 2] +
                        ',' + (data[pos * 4 + 3] / 255) + ')';
                    ctx.fillRect(x + dx, y + dy, 1, 1);
                }
            }
        }
    }

    drawLine = (x0, y0, x1, y1, color) => {
        const { canvasPositions } = this.props.canvasDatas;
        const { context, contextAction,  } = this.props.currentCanvasData;
        const current = this.props.currentCanvasData;
        let { top, left } = canvasPositions;
        const windowOffsetTop = window.pageYOffset;
        const windowOffsetLeft = window.pageXOffset;
        top -= windowOffsetTop;
        left -= windowOffsetLeft;
        x0 -= left;
        y0 -= top;
        x1 -= left;
        y1 -= top;

        if(contextAction === 'draw') {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = this.state.lineSize || 3;
            context.lineCap = 'butt';
            context.stroke();
            context.closePath();
        } else if(contextAction === 'erase') {
            const eraseSize = current.eraseSize;
            x0 = x0 - (eraseSize / 2);
            y0 = y0 - (eraseSize / 2);
            context.clearRect(x0, y0, eraseSize, eraseSize);
        } else if(contextAction === 'ellipse') { //! temp
            const strokeSize = this.props.currentCanvasData.strokeSize;
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = strokeSize;
            context.lineCap = 'round';
            context.stroke();
            context.closePath();
        } //! end temp
    }

    drawArrow = (fromx, fromy, tox, toy) => {
        const ctx = this.props.currentCanvasData.context;
        //variables to be used when creating the arrow
        var headlen = 6;
        var angle = Math.atan2(toy - fromy, tox - fromx);
        //starting path of the arrow from the start square to the end square and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.strokeStyle = "#cc0000";
        ctx.lineWidth = 10;
        ctx.stroke();
        //starting a new path from the head of the arrow to one of the sides of the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));
        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
        //draws the paths created above
        ctx.strokeStyle = "#cc0000";
        ctx.lineWidth = 22;
        ctx.stroke();
    }

    mouseDownHandler = e => {
        const current = this.props.currentCanvasData;
        
        // if you change the color the alpha isn't set, so we change again the color to set the alpha
        let newColor = current.color.replace(/[0-1]+([.][0-9]*)?\)$/, current.alpha + ')');
        current.color = newColor;

        current.x = e.clientX;
        current.y = e.clientY;
        current.drawing = true;
        changeCurrentCanvasData(current)
    }

    mouseUpHandler = e => {
        const current = this.props.currentCanvasData;

        if (!current.drawing) {return};
        changeCurrentCanvasData(current.drawing = false)
        this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    }

    mouseMoveHandler = e => {
        const current = this.props.currentCanvasData;

        if (!current.drawing) {return};
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

    dragOverHandler = (e, type) => {
        e.preventDefault();
        if(type !== 'html')
          this.props.changeCurrentCanvasData({ ...this.props.currentCanvasData, draggingOut: false });
    }

    dragLeaveHandler = () =>
        this.props.changeCurrentCanvasData({ ...this.props.currentCanvasData, draggingOut: true });

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
            });
            this.props.setCanvasField(inputsUpdate);
        }
    }

    render() {
        const { imageData } = this.props;
        const {
            mouseDownHandler,
            mouseUpHandler,
            mouseMoveHandler,
            throttle,
            dragOverHandler,
            dragLeaveHandler,
        } = this;
        const { width, height } = imageData;

        const inputsElement = this.props.inputs.map(input => input.element);

        return (
            <div>
                <div style={{userSelect: 'none'}} className="canvas-container" onDragLeave={dragLeaveHandler} onDragOver={dragOverHandler}>
                    <canvas
                        style={{userSelect: 'none'}}
                        className="canvas droppable"
                        id="canvas"
                        width={width && width - 300}
                        height={height && height}
                        onMouseDown={mouseDownHandler}
                        onMouseUp={mouseUpHandler}
                        onMouseMove={throttle(mouseMoveHandler, 10)}
                    ></canvas>
                    {inputsElement}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);