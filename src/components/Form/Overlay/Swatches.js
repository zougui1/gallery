import React from 'react';
import { connect } from 'react-redux';
import Slider from '@material-ui/lab/Slider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { FaEraser } from 'react-icons/fa';

import swatches from '../../../data/swatches';
import { uploader } from '../../../store/actions';
import { mapDynamicState } from '../../../utils';
import CanvasField from './CanvasField';

import '../form.scss';

const {
    changeCurrentCanvasData,
    addCanvasField,
    addCanvasLabel,
    editCanvasField,
    setCanvasField,
} = uploader;

const mapStateToProps = mapDynamicState('currentCanvasData imageData inputs labels', 'uploader');
const mapDispatchToProps = dispatch => ({ 
  changeCurrentCanvasData: currentCanvasData => dispatch(changeCurrentCanvasData(currentCanvasData)),
  addCanvasField: field => dispatch(addCanvasField(field)),
  addCanvasLabel: label => dispatch(addCanvasLabel(label)),
  editCanvasField: (field, id) => dispatch(editCanvasField(field, id)),
  setCanvasField: field => dispatch(setCanvasField(field)),
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
        inputKey: 0,
    }

    updateCurrentCanvasData = () => changeCurrentCanvasData(this.props.currentCanvasData);

    onColorUpdate = (e, color) => {
        const { currentCanvasData } = this.props;
        if(e) {
            if(color !== 'erase') {
                currentCanvasData.color = color;
                this.props.eraseChangeHandler(false);
            }
            else this.props.eraseChangeHandler(true);
        }

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

        this.setState({
            [name]: checked
        });
        this[name]();
    }

    createInput = e => {
        let { inputKey } = this.state;
        let { inputs, canvasDatas } = this.props;
        let current = this.props.currentCanvasData;
        
        const client = {x: 10, y: 10}
        this.props.labels[inputKey] = React.createRef();
        this.props.addCanvasLabel(this.props.labels);
        const element2 = (
            <CanvasField
                key={inputKey}
                _key={inputKey}
                client={client}
                current={current} />
        );

        const input = {
            element: element2,
            inputKey,
            label: this.props.labels[inputKey]
        };
        inputKey++;
        inputs = this.props.inputs.concat(input);
        this.props.addCanvasField(inputs);
        this.setState({ inputKey, lastInput: input })
    }

    render() {
        const {
            onColorUpdate,
            resetCanvas,
            handleCheckboxChange,
            onSlideChange,
            createInput,
        } = this;
        const {
            mainLayer,
            mainLayerCheckbox,
            inputsLayer,
            inputsLayerCheckbox,
            textSizeSliderValue,
            alphaSliderValue,
            eraseSizeSliderValue,
        } = this.state;
        const {
            handleModalOpen
        } = this.props;

        return (
            <div style={{color: 'white', top: '80px'}} className="colors color-picker-panel">
                <div className="panel-row">
                    <div className="swatches default-swatches">
                        {swatches.map(swatch => (
                            <div
                                key={swatch.id}
                                className={`c${swatch.id} swatch color`}
                                onClick={e => onColorUpdate(e, swatch.color)}>
                                {swatch.id === 12 && <FaEraser style={{color: '#000', fontSize: '2.3rem', padding: 0, margin: 0}} />}
                            </div>
                        ))}
                    </div>
                    <div>
                        <label style={{color: 'white'}} htmlFor="alpha">Alpha</label>
                        <Slider
                            style={{padding: '10px 0'}}
                            id="alpha"
                            value={alphaSliderValue}
                            step={0.05}
                            min={0.05}
                            max={1}
                            onChange={onSlideChange('alpha')}
                        />

                        <label style={{color: 'white'}} htmlFor="textSize">Text size</label><br/>
                        <Slider
                            style={{padding: '10px 0'}}
                            id="textSize"
                            value={textSizeSliderValue}
                            step={1}
                            min={16}
                            max={100}
                            onChange={onSlideChange('text', true)}
                        />
                        
                        {
                            this.props.currentCanvasData.contextAction === 'erase' &&
                            <div>
                                <label style={{color: 'white'}} htmlFor="eraseSize">Erase size</label>
                                <Slider
                                    style={{padding: '10px 0'}}
                                    id="eraseSize"
                                    value={eraseSizeSliderValue}
                                    step={1}
                                    min={10}
                                    max={100}
                                    onChange={onSlideChange('erase')}
                                />
                            </div>
                        }
                        
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

                        <br/>
                        <Button style={{color: '#fff'}} onClick={createInput} >Create a textbox</Button>
                        <br/>
                        <Button style={{color: '#fff'}} onClick={resetCanvas} id="reset">Reset</Button>
                        
                        <p style={{ cursor: 'pointer' }} onClick={handleModalOpen}>Need help to draw an overlay?</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swatches);