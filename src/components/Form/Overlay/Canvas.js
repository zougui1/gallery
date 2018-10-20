import React from 'react';

import '../form.scss';

//import CanvasField from './CanvasField';

/*function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}*/

class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drawing: false,
            inputKey: 0,
            inputs: [],
            labels: [],
            draggingOut: false
        }
    }

    componentDidMount = () => {
        this.props.actions.setRef(document.getElementById('canvas'));
        const htmlElement = document.getElementsByTagName('html')[0];
        htmlElement.addEventListener('dragover', e => this.dragOverHandler(e, 'html'));
        htmlElement.addEventListener('drop', this.dropHandler);
    }

    componentDidUpdate = () => {
        let { lastInput } = this.state;
        if(lastInput) {
            lastInput.label.current.focus();
            lastInput = '';
            this.setState({ lastInput });
        }
    }

    drawLine = (x0, y0, x1, y1, color, emit) => {
        const { context, canvasPositions, contextAction, current } = this.props.canvasDatas;
        const { top, left } = canvasPositions;
        x0 -= left;
        y0 -= top;

        if(contextAction === 'draw') {
            context.beginPath();
            context.moveTo(x0 - left, y0 - top);
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
        this.setState({ drawing: true });
        const current = this.props.canvasDatas.current;
        current.x = e.clientX;
        current.y = e.clientY;
        this.props.actions._setState(current);
    }

    mouseUpHandler = e => {
        const { drawing } = this.state;
        const { current } = this.props.canvasDatas;

        if (!drawing) return;
        this.setState({ drawing: false });
        this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    }

    mouseMoveHandler = e => {
        const { drawing } = this.state;
        const { current } = this.props.canvasDatas;

        if (!drawing) return;
        this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
        current.x = e.clientX;
        current.y = e.clientY;
        this.props.actions._setState(current);
    }

    throttle(callback, delay) {
        let previousCall = new Date().getTime();
        return function() {
            let time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    setLabel = (key, label) => {
        let labels = this.state.labels;
        console.log(label)
        labels[key] = label;
        console.log(labels)
        this.setState({ labels });
    }
    
    //TODO put this function into CanvasField
    onInputClick = e => {
        let { inputs } = this.state;
        let { current } = this.props.canvasDatas;
        const key = Number(e.target.getAttribute('data-key'));
        
        const inputsUpdate = inputs.map(input => {
            if(input.inputKey === key) {
                let currentLabel = input.label.current;
                let currentInput = currentLabel.childNodes[1];
                currentInput.style.color = current.color;
                currentInput.style.borderColor = current.color;
                currentInput.style.fontSize = current.size;
                currentLabel.style.color = current.color;
            }
            return input;
        });
        this.setState({ inputs: inputsUpdate });
    }

    inputChangeHandler = e => {
        let { inputs } = this.state;
        const self = e.target;
        const value = self.value.trim();
        const key = Number(self.getAttribute('data-key'));

        const inputsUpdate = inputs.map(input => {
            if(input.inputKey === key) {
                let labelContent = input.label.current.childNodes[0];
                if(value.length > 0) {
                    labelContent.textContent = '';
                } else {
                    labelContent.textContent = 'Input';
                }
            }
            return input
        });
        this.setState({ inputs: inputsUpdate });
    }

    onCreateInput = e => {
        let { inputKey, inputs, labels } = this.state;
        let { current } = this.props.canvasDatas;
        this.setState({ labels });
        
        //TODO puts the label/input into CanvasField and replace it with the code below
        //const client = {x: e.clientX, y: e.clientY}
        // inputs={inputs} doesn't work, because when the state is updated only the render function is refreshed
        // not the functions in the class, so the inputs var is not refreshed after an update
        /*const element = (
            <CanvasField
                key={inputKey}
                _key={inputKey}
                client={client}
                current={current}
                inputs={inputs}
                _setState={this._setState}
                setLabel={this.setLabel} />
        );*/
        labels[inputKey] = React.createRef();
        const element = (
            <label
                draggable
                key={inputKey}
                ref={labels[inputKey]}
                htmlFor={'input-' + inputKey}
                id={'label-' + inputKey}
                style={{top: e.clientY, left: e.clientX, color: current.color}}
                className="canvas-label draggable"
                data-key={inputKey}
                onClick={this.onInputClick}
                onDragStart={this.dragStartHandler}
                onDrop={this.dropHandler}>
                <span>Input</span>
                <input
                    id={'input-' + inputKey}
                    style={{borderColor: current.color}}
                    data-key={inputKey}
                    className="canvas-input"
                    onChange={this.inputChangeHandler}
                />
            </label>
        );

        const input = {
            element,
            inputKey,
            label: this.state.labels[inputKey]
        };
        inputKey++;
        inputs = this.state.inputs.concat(input);
        this.setState({ inputs, inputKey, lastInput: input });
    }

    _setState = (value, name) => {
        if(name) this.setState({ [name]: value });
        else this.setState({ [value]: value });
    }

    dragOverHandler = (e, type) => {
        e.preventDefault();
        if(type !== 'html')this.setState({ draggingOut: false });
    }

    dragStartHandler = e => {
        const id = e.target.getAttribute('data-key');
        e.dataTransfer.setData('key', id);
    }

    dragLeaveHandler = e => {
        this.setState({ draggingOut: true });
    }

    dropHandler = e => {
        let { inputs } = this.state;
        const key = Number(e.dataTransfer.getData('key'));
        let inputsUpdate;

        if(!this.state.draggingOut) {
            inputsUpdate = inputs.map(input => {
                if(input.inputKey === key) {
                    console.log(input)
                    let currentLabel = input.label.current;
                    currentLabel.style.top = e.clientY + 'px';
                    currentLabel.style.left = e.clientX + 'px';
                }
                return input;
            });
        } else {
            inputsUpdate = inputs.filter(input => {
                if(input.inputKey !== key) return input;
            })
        }
        this.setState({ inputs: inputsUpdate });
    }

    render() {
        const { canvasDatas } = this.props;
        const {
            mouseDownHandler,
            mouseUpHandler,
            mouseMoveHandler,
            throttle,
            onCreateInput,
            dragOverHandler,
            dragLeaveHandler
        } = this;
        const { width, height } = canvasDatas;

        const inputsElement = this.state.inputs.map(input => input.element);

        return (
            <div className="canvas-container">
                <canvas
                    className="canvas droppable"
                    id="canvas"
                    width={width}
                    height={height}
                    onMouseDown={mouseDownHandler}
                    onMouseUp={mouseUpHandler}
                    onMouseMove={throttle(mouseMoveHandler, 10)}
                    onDoubleClick={onCreateInput}
                    onDragOver={dragOverHandler}
                    onDragLeave={dragLeaveHandler}
                ></canvas>
                {inputsElement}
            </div>
        );
    }
}

export default Canvas;