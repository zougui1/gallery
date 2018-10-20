import React from 'react';

import '../form.scss';

class CanvasField extends React.Component {

    componentDidMount = () => {
        this.props.setLabel(this.props._key, document.getElementById('label-' + this.props._key));
    }

    onInputClick = e => {
        let { _setState, current, inputs } = this.props;
        const key = Number(e.target.getAttribute('data-key'));
        
        inputs = inputs.map(input => {
            if(input.inputKey === key) {
                let currentLabel = input.label;
                currentLabel.childNodes[1].style.color = current.color;
                currentLabel.style.color = current.color;
            }
            return input;
        });
        _setState(inputs);
    }

    render() {
        const { _key, client, current } = this.props;

        return (
            <label
                htmlFor={'input-' + _key}
                id={'label-' + _key}
                style={{top: client.y, left: client.x, color: current.color}}
                className="canvas-label"
                data-key={_key}
                onClick={this.onInputClick}>
                Input
                <input id={'input-' + _key} data-key={_key} className="canvas-input" />
            </label>
        );
    }
}

export default CanvasField;