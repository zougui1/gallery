import React, { Component } from 'react'
import { connect } from 'react-redux';


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
  }
  

  componentDidMount = () => {
      const id = this.props.match.params.id;
      this.setState({ id: id });
      emit.getImageById(id);
      on.getImageFromDB(image => {this.setState({ image: image });console.log(image)});
  }

  showLayer = type => {
    const { overlays } = this.state;
    const { showOverlay } = this.props;
    const newOverlays = {
      ...showOverlay
    };
    
    newOverlays[type] = !showOverlay[type];
    const element = overlays[type].current;
    
    if(newOverlays[type]) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
    this.props.displayOverlay(newOverlays)
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

  render() { 
    const { image } = this.state;
    const { showOverlay } = this.props;

    return (
      <div style={{position: 'relative'}}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '70px' }}>
          {this.renderImage()}
        </div>
        
        <div style={{color: 'white', marginTop: '65px'}} className="colors color-picker-panel">
            <div className="panel-row">
                <div>
                    <label htmlFor="drawLayer">Display draw</label>
                    <input checked={showOverlay.draw} onChange={() => this.showLayer('draw')} type="checkbox" name="drawLayer" id="drawLayer" />
                    <br />
                    <label htmlFor="textLayer">Display text</label>
                    <input checked={showOverlay.text} onChange={() => this.showLayer('text')} type="checkbox" name="textLayer" id="textLayer" />
                </div>
            </div>
            <div className="panel-row">
              <span>artist: <a target="blank" style={{color: 'white'}} href={this.validUrl(image.artistLink)}>{image.artistName}</a></span>
              <br />
              <span>character: {image.characterName}</span>
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