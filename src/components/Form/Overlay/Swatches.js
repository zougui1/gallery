import React from 'react';

import swatches from '../../../data/swatches';

import '../form.scss';

const Swatches = ({ actions, current }) => {
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

    return (
        <div className="colors color-picker-panel">
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
                </div>
            </div>
        </div>
    );
}

export default Swatches;