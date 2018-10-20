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
        this.setSize();
        this.setState({
            context: this.canvas.getContext('2d'),
            canvasPositions: getPosition(this.canvas)
        })
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

    render() {
      const {
          onAlphaEdit,
          onCreateInput,
          setImageTemp,
          setRef,
          _setState,
          imgRef
        } = this;
      const { imageTemp } = this.props;
      const {
          width,
          height,
          inputs,
          current,
          canvasPositions,
          context
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
          context
      }
      const swatchesActions = {
          onAlphaEdit,
          _setState
      }

        return (
            <div className="overlay-container">
                <Canvas actions={canvasActions} canvasDatas={canvasDatas} />
                <img onLoad={setImageTemp} className="draw-on" ref={imgRef} src={imageTemp} alt=""/>
                
                <Swatches current={current} actions={swatchesActions} />
            </div>
        );
    }
}

export default Overlay;