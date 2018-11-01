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
  setCurrentUser,
  setCurrentPage,
} = gallery;

const mapStateToProps = mapDynamicState('showOverlay images', 'gallery');
const mapDispatchToProps = dispatch => ({
  setImages: images => dispatch(setImages(images)),
  setFilteredImages: images => dispatch(setFilteredImages(images)),
  setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser)),
  setCurrentPage: currentUser => dispatch(setCurrentPage(currentUser)),
})
export class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      page: 1,
    }
    const page = this.props.match.params.page;
    this.props.setCurrentPage(page)
    this.setState({ page })
  }

  componentDidMount = () => {
      const username = this.props.match.params.username;
      this.props.setCurrentUser(username)
      this.setState({ username });
      setTimeout(this.request, 0);
  }  

  request = () => {
      const req = {
        username: this.state.username,
        page: this.state.page,
      };
      console.log('request')
      emit.retrieveImagesByUser(req);
      on.retrieveImagesFromDB(images => {
        this.props.setImages(images);
      })
  }
  

  render() {
    return (
      <div>
        <div className="left">
          <div className="images-container">
            {
                this.props.images.length > 0
                ? <Images username={this.state.username} page={this.state.page} />
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
