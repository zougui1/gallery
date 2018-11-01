import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


import { mapDynamicState, getPosition } from '../../utils';
import { gallery } from '../../store/actions';
import Pagination from '../Pagination';

const {
  getFilteredImages,
  setCurrentPage,
} = gallery;

//const mapStateToProps = mapDynamicState('showOverlay filteredImages', 'gallery');
const mapStateToProps = state => ({
  showOverlay: state.galleryReducer.showOverlay,
  filteredImages: state.galleryReducer.filteredImages,
  state: state,
})

const mapDispatchToProps = dispatch => ({
  setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
});

class Images extends Component {  

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

  resizeContainer = e => {
    const self = e.target;
    const width = self.offsetWidth;
    self.offsetParent.style.width = `${width}px`;
  }

  render() {
    const filteredImages = getFilteredImages(this.props.state);
    
    return (
      <div className="images">
        <div>
          {filteredImages.map((image, i) => (
              <div key={image._id} className="image-container">
                  <Link to={'/image/' + image._id}>
                      <img onLoad={this.resizeContainer} className="image mainImage" src={'https://ucarecdn.com/' + image.image} alt="" />
                      {this.renderOverlays(image)}
                  </Link>
              </div>
          ))}
        </div>
        <div className="pagination">
          <Pagination currentPage={this.props.page} basePath={`/user/${this.props.username}`} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Images);