import React from 'react';

import swatches from '../../../data/swatches';

import '../form.scss';

const Swatches = ({ actions }) => {
    const { onColorUpdate, onAlphaEdit } = actions;

    return (
        <div className="colors color-picker-panel">
            <div className="panel-row">
                <div className="swatches default-swatches">
                    {swatches.map(swatch => (
                        <div
                            key={swatch.id}
                            className={`c${swatch.id} swatch color ${swatch.color}`}
                            onClick={onColorUpdate}></div>
                    ))}
                </div>
                <div>
                    <label style={{color: 'white'}} htmlFor="alpha">Alpha</label>
                    <input
                        id="alpha"
                        placeholder="1.0"
                        type="text"
                        onChange={onAlphaEdit} />
                </div>
            </div>
        </div>
    );
}

export default Swatches;