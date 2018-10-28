import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';

const {
  getFilteredImages,
} = gallery;

//const mapStateToProps = mapDynamicState('showOverlay filteredImages', 'gallery');
const mapStateToProps = state => ({
  showOverlay: state.galleryReducer.showOverlay,
  filteredImages: state.galleryReducer.filteredImages,
  state: state,
})

class Images extends Component {

  componentDidMount = () => {
    console.log(this.props.filteredImages)
  }

  renderOverlays = image => {
    const { showOverlay } = this.props;
    if(showOverlay.all && image.canvas) {
      const { canvas } = image;
      let overlays = [];

      for (const key in canvas) {
        const imageElement = (
          <img key={canvas[key]} className={'image overlay ' + key} src={'https://ucarecdn.com/' + canvas[key]} alt="" />
        );
        overlays.push(imageElement);
      }
      return overlays
    }
  }

  render() {
    const filteredImages = getFilteredImages(this.props.state);

    return (
      <div className="images">
        {filteredImages.map(image => (
            <div key={image._id} className="image-container">
                <Link to={'/image/' + image._id}>
                  <div className="overlay-container">
                    <img className="image mainImage" src={'https://ucarecdn.com/' + image.image} alt="" />
                    <span className="overlays">
                      {this.renderOverlays(image)}
                    </span>
                  </div>
                </Link>
            </div>
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Images);