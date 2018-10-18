import React from 'react';
import ReactDom from 'react-dom';

import { getPosition } from '../../../utils/';

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
                color: 'rgba(0,0,0,1)'
            },
            inputs: [],
            labels: []
        }

        this.imgRef = React.createRef();
        this.canvas = null;
    }

    componentDidMount = () => {
        console.log(this.canvas)
        this.setSize();
        this.setState({
            context: this.canvas.getContext('2d'),
            canvasPositions: getPosition(this.canvas)
        })
    }

    setSize = () => {
        console.log(this.imgRef)
        const img = this.imgRef.current;
        
        img.addEventListener('load', () => {
            const height = img.offsetHeight;
            const width = img.offsetWidth;
            this.setState({ width: width, height: height });
        })
    }

    drawLine = (x0, y0, x1, y1, color, emit) => {
        const { context, canvasPositions } = this.state;
        const { top, left } = canvasPositions;
        
        context.beginPath();
        context.moveTo(x0 - left, y0 - top);
        context.lineTo(x1 - left, y1 - top);
        context.strokeStyle = color;
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
    }

    mouseDownHandler = e => {
        this.setState({drawing: true});
        const current = this.state.current;
        current.x = e.clientX;
        current.y = e.clientY;
        this.setState({current});
    }

    mouseUpHandler = e => {
        const { drawing, current } = this.state;
        if (!drawing) return;
        this.setState({drawing: false});
        this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    }

    mouseMoveHandler = e => {
        const { drawing, current } = this.state;
        if (!drawing) return;
        this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
        current.x = e.clientX;
        current.y = e.clientY;
        this.setState({current});
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

    onColorUpdate = e => {
        const current = this.state.current;
        if(e) current.color = e.target.className.split(' ')[3];

        if(current.alpha) {
            const colorParts = current.color.split(',');
            const newColor = colorParts[0] + ',' + colorParts[1] + ',' + colorParts[2] + ',' + current.alpha + ')'
            current.color = newColor;
        }
        this.setState({current});
    }

    onAlphaEdit = e => {
        const {value} = e.target;
        const regex = /^[0-1]([,|.][0-9]+)?$/;
        if(regex.test(value) || value === '') {
            const current = this.state.current;
            let alpha;

            if(value === '') alpha = '1';
            else alpha = value.replace(',', '.');

            current.alpha = alpha;
            this.setState({current});
            this.onColorUpdate();
        } else {
            console.log('not a valid alpha')
        }
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

    onInputClick = e => {
        const self = e.target;
        console.log(self)
        let { current, inputs } = this.state;
        const key = self.getAttribute('data-key');
        inputs = inputs.map(input => {
            if(input.inputKey == key) {
                let currentLabel = input.label.current;
                currentLabel.childNodes[1].style.color = current.color;
                currentLabel.style.color = current.color;
            }
            return input;
        });
        this.setState({ inputs });
    }

    setRef = ref => this.canvas = ref;

    _setState = (name, value) => this.setState({ [name]: value });

    render() {
      const {
          onAlphaEdit,
          onColorUpdate,
          mouseDownHandler,
          mouseUpHandler,
          mouseOutHandler,
          throttle,
          mouseMoveHandler,
          onCreateInput,
          setImageTemp,
          setRef,
          _setState,
          imgRef
        } = this;
      const { imageTemp } = this.props;
      const { width, height, inputs } = this.state;
      const inputsElement = inputs.map(input => input.element);
      const canvasActions = {
          mouseDownHandler,
          mouseUpHandler,
          mouseOutHandler,
          throttle,
          mouseMoveHandler,
          onCreateInput,
          setRef,
          _setState
      }
      const swatchesActions = {
          onAlphaEdit,
          onColorUpdate,
          _setState
      }

        return (
            <div className="overlay-container">
                <Canvas actions={canvasActions} width={width} height={height} />
                {inputsElement}
                <img onLoad={setImageTemp} className="draw-on" ref={imgRef} src={imageTemp} alt=""/>
                
                <Swatches actions={swatchesActions} />
            </div>
        );
    }
}

export default Overlay;