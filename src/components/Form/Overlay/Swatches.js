import React from 'react';

import swatches from '../../../data/swatches';

import '../form.scss';

const Swatches = ({ actions, current, context, size, overlayContainer, lastFocused }) => {
    //const { onColorUpdate, onAlphaEdit } = actions;
    const { _setState } = actions;

    const onColorUpdate = (e, color) => {
        if(e) current.color = color;

        if(current.alpha) {
            let newColor = current.color.replace(/[0-1]+([.][0-9]*)?\)$/, current.alpha + ')');
            current.color = newColor;
        }
        _setState(current);
    }
    
    const onAlphaEdit = e => {
        const value = e.target.value.trim();
        const regex = /^[0-1]([,|.][0-9]+)?$/;
        if(regex.test(value) || value === '') {
            let alpha;

            if(value === '') alpha = '1';
            else alpha = value.replace(',', '.');

            current.alpha = alpha;
            _setState(current);
            onColorUpdate();
        } else {
            console.log('not a valid alpha')
        }
    }

    const onTextSizeEdit = e => {
        const value = e.target.value.trim();
        const regex = /^[0-9]+(px)?$/;
        if(regex.test(value) || value === '') {
            let size;

            if(value === '') size = '16px';
            else if(/[0-9]+/) size = `${value}px`;
            else size = value;

            const valNum = Number(value);
            if(valNum > 100) size = '100px';
            else if(valNum < 16) size = '16px';

            current.size = size;
            _setState(current);
        }
    }

    const onEraseSizeEdit = e => {
        let value = e.target.value.trim();
        const regex = /^[0-9]+(px)?$/;
        if(regex.test(value) || value === '') {
            let size;
            value = value.replace('px', '');
            value = Number(value);

            if(value === '') size = 10;
            else size = value;

            if(value > 100) size = 100;
            else if(value < 16) size = 10;

            current.eraseSize = size;
            _setState(current);
        }
    }

    const resetCanvas = e => {
        const { height, width } = size;
        context.clearRect(0, 0, width, height)
    }

    const inputsLayer = e => {
        if(current.displayInputs) overlayContainer.classList.add('hideInputs');
        else overlayContainer.classList.remove('hideInputs');

        current.displayInputs = !current.displayInputs;
        _setState(current)
    }

    const mainLayer = e => {
        if(current.displayMainLayer) context.canvas.classList.add('hide');
        else context.canvas.classList.remove('hide');

        current.displayMainLayer = !current.displayMainLayer;
        _setState(current)
    }

    return (
        <div style={{color: 'white'}} className="colors color-picker-panel">
            <div className="panel-row">
                <div className="swatches default-swatches">
                    {swatches.map(swatch => (
                        <div
                            key={swatch.id}
                            className={`c${swatch.id} swatch color`}
                            onClick={e => onColorUpdate(e, swatch.color)}></div>
                    ))}
                </div>
                <div>
                    <label style={{color: 'white'}} htmlFor="alpha">Alpha</label>
                    <input
                        id="alpha"
                        placeholder="1.0"
                        type="text"
                        onChange={onAlphaEdit} />
                    <br />
                    <label style={{color: 'white'}} htmlFor="size">Text size</label>
                    <input
                        id="size"
                        placeholder="16px"
                        type="text"
                        onChange={onTextSizeEdit} />
                    <label style={{color: 'white'}} htmlFor="erase">Erase</label>
                    <input onChange={actions.eraseChangeHandler} type="checkbox" name="erase" id="erase" />
                    <br />
                    <label style={{color: 'white'}} htmlFor="size">Erase size</label>
                    <input
                        id="eraseSize"
                        placeholder="10px"
                        type="text"
                        onChange={onEraseSizeEdit} />
                    <br />
                    <button onClick={resetCanvas} id="reset">Reset</button>
                    <br />
                    <label htmlFor="inputsLayer">Display text</label>
                    <input checked={current.displayInputs} onChange={inputsLayer} type="checkbox" name="inputsLayer" id="inputsLayer" />
                    <br />
                    <label htmlFor="mainLayer">Display draw</label>
                    <input checked={current.displayMainLayer} onChange={mainLayer} type="checkbox" name="mainLayer" id="mainLayer" />
                    
                    <p>Tips:<br />
                    you can double click on the image to create an input<br />
                    you can drag the input out of the image to delete the input</p>
                </div>
            </div>
        </div>
    );
}

export default Swatches;