import React, { Component } from 'react'
import { connect } from 'react-redux';

import './user.scss';

import Images from './Images';

import { emit, on } from '../../socket/user';

import RightPanel from './RightPanel';

import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';

const {
  setImages,
  setFilteredImages,
} = gallery;

const mapStateToProps = mapDynamicState('showOverlay displayImages filteredImages', 'gallery');
const mapDispatchToProps = dispatch => ({
  setImages: images => dispatch(setImages(images)),
  setFilteredImages: images => dispatch(setFilteredImages(images)),
})
export class User extends Component {

  state = {
      username: '',
  }

  componentDidMount = () => {
      const username = this.props.match.params.username;
      this.setState({ username: username });
      emit.retrieveImagesByUser(username);
      on.retrieveImagesFromDB(images => {
        console.log(images);
        this.props.setImages(images);
        this.props.setFilteredImages(images);
      })
  }

  render() {
    return (
      <div>
        <div className="left">
          <div className="images-container">
            {
                this.props.filteredImages.length > 0
                ? <Images />
                : ''
            }
          </div>
        </div>
        <div className="right">
            <RightPanel />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
