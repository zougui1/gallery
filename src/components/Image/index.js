import React, { Component } from 'react'
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';


import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';

import { emit, on } from '../../socket/user';
import Loading from '../Loading';

const {
  displayOverlay,
} = gallery;

const mapStateToProps = mapDynamicState('showOverlay', 'gallery');
const mapDispatchToProps = dispatch => ({
  displayOverlay: showOverlay => dispatch(displayOverlay(showOverlay))
})
class Image extends Component {

  state = {
      id: '',
      image: {},
      overlays: {
        draw: React.createRef(),
        text: React.createRef()
      },
      showOverlayUpdated: false,
  }
  

  componentDidMount = () => {
      const id = this.props.match.params.id;
      this.setState({ id: id });
      emit.getImageById(id);
      on.getImageFromDB(image => {this.setState({ image: image });console.log(image)});
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log(prevProps, this.props)
  }
  

  showLayer = type => e => {
    const { overlays } = this.state;
    const { showOverlay } = this.props;
    const newOverlays = {
      ...showOverlay
    };

    newOverlays[type] = !showOverlay[type];
    const element = overlays[type].current;

    if (element) {
      if (newOverlays[type]) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
      this.props.displayOverlay(newOverlays)
    }
  }

  validUrl = url => {
    const regex = /(https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    if(regex.test(url)) return url;
    return '#';
  }

  renderImage = () => {
    const { image } = this.state;
    let imageElment = [];
    if(image.image) imageElment.push(<img key={image.image} style={{position: 'absolute'}} className="image-full" src={'https://ucarecdn.com/' + image.image} alt="" />);
    const overlay = this.getOverlay();
    imageElment = [
      ...imageElment,
      ...overlay
    ];
    return imageElment;
  }

  getOverlay = () => {
    const { image } = this.state;
    let overlayElement = [];
    for (const key in image.canvas) {
      overlayElement.push(
        <img key={image.canvas[key]} style={{position: 'absolute'}} className={`image-full overlay ${key}`} ref={this.state.overlays[key]} src={'https://ucarecdn.com/' + image.canvas[key]} alt="" />
      );
    }
    return overlayElement;
  }

  renderCheckbox = () => {
    const { canvas } = this.state.image;
    const { showLayer } = this;
    const { showOverlay } = this.props;

    let checkboxElement = [];
    for (const key in canvas) {
      checkboxElement.push(
        <div>
          <label htmlFor={`${key}Layer`}>Display {key}</label>
          <Checkbox
              onClick={showLayer(key)}
              onChange={showLayer(key)}
              checked={showOverlay[key]}
              name={`${key}Layer`}
              id={`${key}Layer`}
          />
        </div>
      );
    }
    return checkboxElement;
  }

  render() { 
    const { image } = this.state;

    return (
      <div style={{position: 'relative'}}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '70px' }}>
          {this.renderImage()}
        </div>
        
        <div style={{color: 'white', marginTop: '65px'}} className="colors color-picker-panel">
          <div className="panel-row">
            <div>
              {this.renderCheckbox()}
            </div>
          </div>
          <div className="panel-row">
            <span>Artist: <a target="blank" style={{color: 'white'}} href={this.validUrl(image.artistLink)}>{image.artistName}</a></span>
            <br />
            <span>Character: {image.characterName}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Loading loading={!image.image} size={60} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Image);