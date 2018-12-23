import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { gallery } from '../../store/actions';
import Pagination from '../Pagination';

const {
  getFilteredImages,
  setCurrentPage,
  setRequestReceived,
} = gallery;

const mapStateToProps = state => ({
  showOverlay: state.galleryReducer.showOverlay,
  filteredImages: state.galleryReducer.filteredImages,
  images: state.galleryReducer.images,
  state: state,
})

const mapDispatchToProps = dispatch => ({
  setCurrentPage: currentPage => dispatch(setCurrentPage(currentPage)),
  setRequestReceived: received => dispatch(setRequestReceived(received)),
});

class Images extends Component {

  componentDidMount = prevProps => {
    const { setRequestReceived } = this.props;
    setTimeout(() => setRequestReceived(false), 500);
    console.log(prevProps)
    console.log(this.props)
  }

  renderOverlays = image => {
    const { showOverlay } = this.props;
    if(showOverlay.all && image.canvas) {
      const { canvas } = image;
      let overlays = [];

      for (const key in canvas) {
        const imageElement = (
          <img key={canvas[key]} className={'image overlay ' + key} src={canvas[key]} alt="" />
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
                      <img onLoad={this.resizeContainer} className="image mainImage" src={image.thumb} alt="" />
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
