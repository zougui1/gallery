import React from 'react';
import { connect } from 'react-redux';

import swatches from '../../../data/swatches';
import { changeCurrentCanvasData } from '../../../actions/';

import '../form.scss';

const mapStateToProps = state => ({currentCanvasData: state.currentCanvasData, imageData: state.imageData });
const mapDispatchToProps = dispatch => ({ 
  changeCurrentCanvasData: currentCanvasData => dispatch(changeCurrentCanvasData(currentCanvasData)),
 });
const Swatches = ({ eraseChangeHandler, overlayContainer, imageData, currentCanvasData, changeCurrentCanvasData }) => {

    const updateCurrentCanvasData = () => changeCurrentCanvasData(currentCanvasData);

    const onColorUpdate = (e, color) => {
        if(e) {currentCanvasData.color = color; currentCanvasData.color = color;}

        if (currentCanvasData.alpha) {
            let newColor = currentCanvasData.color.replace(/[0-1]+([.][0-9]*)?\)$/, currentCanvasData.alpha + ')');
            currentCanvasData.color = newColor;
        }
        updateCurrentCanvasData();
    }
    
    const onAlphaEdit = e => {
        const value = e.target.value.trim();
        const regex = /^[0-1]([,|.][0-9]+)?$/;
        if(regex.test(value) || value === '') {
            let alpha;

            if(value === '') alpha = '1';
            else alpha = value.replace(',', '.');

            currentCanvasData.alpha = alpha;
            updateCurrentCanvasData();
            onColorUpdate();
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

            currentCanvasData.fontSize = size;
            updateCurrentCanvasData();
        }
    }

    const onEraseSizeEdit = e => {
        let value = e.target.value.trim();
        const regex = /^[0-9]+(px)?$/;
        if(regex.test(value) || value === '') {
            let size;
            value = value.replace('px', '');
            value = Number(value);

            if(value === '') size = 16;
            else size = value;

            if(value > 100) size = 100;
            else if(value < 16) size = 16;

            currentCanvasData.eraseSize = size;
            updateCurrentCanvasData();
        }
    }

    const resetCanvas = e => currentCanvasData.context.clearRect(0, 0, imageData.width, imageData.height);

    const inputsLayer = e => {
        if(currentCanvasData.displayInputs) overlayContainer.classList.add('hideInputs');
        else overlayContainer.classList.remove('hideInputs');

        currentCanvasData.displayInputs = !currentCanvasData.displayInputs;
        updateCurrentCanvasData();
    }

    const mainLayer = e => {
        if (currentCanvasData.displayMainLayer) currentCanvasData.context.canvas.classList.add('hide');
        else currentCanvasData.context.canvas.classList.remove('hide');

        currentCanvasData.displayMainLayer = !currentCanvasData.displayMainLayer;
        updateCurrentCanvasData();
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
                    <input onChange={eraseChangeHandler} type="checkbox" name="erase" id="erase" />
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
                    <input checked={currentCanvasData.displayInputs} onChange={inputsLayer} type="checkbox" name="inputsLayer" id="inputsLayer" />
                    <br />
                    <label htmlFor="mainLayer">Display draw</label>
                    <input checked={currentCanvasData.displayMainLayer} onChange={mainLayer} type="checkbox" name="mainLayer" id="mainLayer" />
                    
                    <p>Tips:<br />
                    you can double click on the image to create an input<br />
                    you can drag the input out of the image to delete the input</p>
                </div>
            </div>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Swatches);