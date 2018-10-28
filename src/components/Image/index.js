import React, { Component } from 'react'
import { connect } from 'react-redux';


import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';

import { emit, on } from '../../socket/user';

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
      }
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

  render() { 
    const image = this.state.image;
    const { showOverlay } = this.props;
    return (
      <div style={{position: 'relative'}}>
        {
          image.image
          ? <img style={{position: 'absolute'}} className="image-full" src={'https://ucarecdn.com/' + image.image} alt="" />
          : ''
        }
        {
          image.canvas && image.canvas.draw
          ? <img style={{position: 'absolute'}} className="image-full overlay draw" ref={this.state.overlays.draw} src={'https://ucarecdn.com/' + image.canvas.draw} alt="" />
          : ''
        }
        {
          image.canvas && image.canvas.text
          ? <img style={{position: 'absolute'}} className="image-full overlay text" ref={this.state.overlays.text} src={'https://ucarecdn.com/' + image.canvas.text} alt="" />
          : ''
        }
        
        <div style={{color: 'white'}} className="colors color-picker-panel">
            <div className="panel-row">
                <div>
                    <label htmlFor="inputsLayer">Display draw</label>
                    <input checked={showOverlay.draw} onChange={() => this.showLayer('draw')} type="checkbox" name="inputsLayer" id="inputsLayer" />
                    <br />
                    <label htmlFor="mainLayer">Display text</label>
                    <input checked={showOverlay.text} onChange={() => this.showLayer('text')} type="checkbox" name="mainLayer" id="mainLayer" />
                </div>
            </div>
            <div className="panel-row">
              <a target="blank" style={{color: 'white'}} href={image.artistLink}>artist: {image.artistName}</a>
              <br />
              <span>character: {image.characterName}</span>
            </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Image);