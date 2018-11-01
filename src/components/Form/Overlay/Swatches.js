import React from 'react';
import { connect } from 'react-redux';
import Slider from '@material-ui/lab/Slider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import swatches from '../../../data/swatches';
import { uploader } from '../../../store/actions';
import { mapDynamicState } from '../../../utils';

import '../form.scss';

const {
    changeCurrentCanvasData,
} = uploader;

const mapStateToProps = mapDynamicState('currentCanvasData imageData', 'uploader');
const mapDispatchToProps = dispatch => ({ 
  changeCurrentCanvasData: currentCanvasData => dispatch(changeCurrentCanvasData(currentCanvasData)),
 });
class Swatches extends React.Component {
    state = {
        textSizeSliderValue: 16,
        eraseSizeSliderValue: 10,
        alphaSliderValue: 0.5,
        erase: false,
        eraseCheckbox: React.createRef(),
        mainLayer: true,
        mainLayerCheckbox: React.createRef(),
        inputsLayer: true,
        inputsLayerCheckbox: React.createRef(),
    }

    updateCurrentCanvasData = () => changeCurrentCanvasData(this.props.currentCanvasData);

    onColorUpdate = (e, color) => {
        const { currentCanvasData } = this.props;
        if(e) {currentCanvasData.color = color; currentCanvasData.color = color;}

        if (currentCanvasData.alpha) {
            let newColor = currentCanvasData.color.replace(/[0-1]+([.][0-9]*)?\)$/, currentCanvasData.alpha + ')');
            currentCanvasData.color = newColor;
        }
        this.updateCurrentCanvasData();
    }

    onSlideChange = (slider, hasPx) => (e, value) => {
        const { currentCanvasData } = this.props;
        let genericName;

        if(slider !== 'alpha') genericName = slider + 'Size';
        else genericName = slider
        let sliderName = genericName + 'SliderValue';

        this.setState({ [sliderName]: value })
        
        if(hasPx) value = value + 'px';
        currentCanvasData.fontSize = value;
        this.updateCurrentCanvasData();
        currentCanvasData[genericName] = value;
        if(slider === 'alpha') this.onColorUpdate();
    }

    resetCanvas = e => this.props.currentCanvasData.context.clearRect(0, 0, this.props.imageData.width, this.props.imageData.height);

    inputsLayer = e => {
        const { currentCanvasData, overlayContainer } = this.props;

        if(currentCanvasData.displayInputs) overlayContainer.classList.add('hideInputs');
        else overlayContainer.classList.remove('hideInputs');

        currentCanvasData.displayInputs = !currentCanvasData.displayInputs;
        this.updateCurrentCanvasData();
    }

    mainLayer = e => {
        const { currentCanvasData } = this.props;

        if (currentCanvasData.displayMainLayer) currentCanvasData.context.canvas.classList.add('hide');
        else currentCanvasData.context.canvas.classList.remove('hide');

        currentCanvasData.displayMainLayer = !currentCanvasData.displayMainLayer;
        this.updateCurrentCanvasData();
    }

    handleCheckboxChange = name => () => {
        const checkboxElement = this.state[name + 'Checkbox'].current;
        let checked = checkboxElement.props.checked;
        checked = !checked;
        console.log(checked)

        this.setState({
            [name]: checked
        });
        if(name === 'erase') this.props.eraseChangeHandler(checked);
        else this[name]();
    }

    render() {
        const {
            onColorUpdate,
            resetCanvas,
            handleCheckboxChange,
            onSlideChange,
        } = this;
        const {
            erase,
            eraseCheckbox,
            mainLayer,
            mainLayerCheckbox,
            inputsLayer,
            inputsLayerCheckbox,
        } = this.state;

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
                        <Slider
                            style={{padding: '10px 0'}}
                            id="alpha"
                            value={this.state.alphaSliderValue}
                            step={0.05}
                            min={0.05}
                            max={1}
                            onChange={onSlideChange('alpha')}
                        />

                        <label style={{color: 'white'}} htmlFor="textSize">Text size</label><br/>
                        <Slider
                            style={{padding: '10px 0'}}
                            id="textSize"
                            value={this.state.textSizeSliderValue}
                            step={1}
                            min={16}
                            max={100}
                            onChange={onSlideChange('text', true)}
                        />
                            
                        <label style={{color: 'white'}} htmlFor="erase">Erase</label>
                        <Checkbox
                            onClick={handleCheckboxChange('erase')}
                            onChange={handleCheckboxChange('erase')}
                            checked={erase}
                            name="erase"
                            id="erase"
                            ref={eraseCheckbox}
                        />
                        <br/>
                        
                        <label style={{color: 'white'}} htmlFor="eraseSize">Erase size</label>
                        <Slider
                            style={{padding: '10px 0'}}
                            id="eraseSize"
                            value={this.state.eraseSizeSliderValue}
                            step={1}
                            min={10}
                            max={100}
                            onChange={onSlideChange('erase')}
                        />
                        <Button style={{color: '#fff'}} onClick={resetCanvas} id="reset">Reset</Button>
                        <br/>
                        
                        <label htmlFor="inputsLayer">Display text</label>
                        <Checkbox
                            onClick={handleCheckboxChange('inputsLayer')}
                            onChange={handleCheckboxChange('inputsLayer')}
                            checked={inputsLayer}
                            name="inputsLayer"
                            id="inputsLayer"
                            ref={inputsLayerCheckbox}
                        />

                        <label htmlFor="mainLayer">Display draw</label>
                        <Checkbox
                            onClick={handleCheckboxChange('mainLayer')}
                            onChange={handleCheckboxChange('mainLayer')}
                            checked={mainLayer}
                            name="mainLayer"
                            id="mainLayer"
                            ref={mainLayerCheckbox}
                        />
                        
                        <p>Tips:<br />
                        you can double click on the image to create an input<br />
                        you can drag the input out of the image to delete the input</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swatches);