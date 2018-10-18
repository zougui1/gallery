import React from 'react';

import '../form.scss';

class Canvas extends React.Component {

    componentDidMount = () => {
        this.props.actions.setRef(document.getElementById('canvas'));
    }

    render() {
        const { actions, width, height } = this.props;
        const {
            mouseDownHandler,
            mouseUpHandler,
            mouseOutHandler,
            throttle,
            mouseMoveHandler,
            onCreateInput
        } = actions;

        return (
            <canvas
                className="canvas"
                id="canvas"
                width={width}
                height={height}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseOut={mouseOutHandler}
                onMouseMove={throttle(mouseMoveHandler, 10)}
                onDoubleClick={onCreateInput}
            ></canvas>
        );
    }
}

export default Canvas;