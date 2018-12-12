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

const mapStateToProps = mapDynamicState('showOverlay images filter', 'gallery');
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
      requestReceived: false,
    }
    const page = this.props.match.params.page;
    if(page) {
      this.props.setCurrentPage(page)
      this.setState({ page })
    }
  }

  componentDidMount = () => {
    const username = this.props.match.params.username;
    this.props.setCurrentUser(username)
    this.setState({ username });
    setTimeout(this.request, 0);
  }

  request = () => {
    let req = {
      username: this.state.username,
      page: Number(this.state.page),
      tags: this.props.filter,
    };
    emit.getImagesByUserAndTags(req);
    on.retrieveImagesFromDB(images => {
      this.setState({ requestReceived: true })
      this.props.setImages(images);
    })
  }


  render() {
    const { images } = this.props;
    const { username, page, requestReceived } = this.state;

    return (
      <div>
        <div className="left">
          <div className="images-container">
            {
              images.length > 0
              ? <Images username={username} page={page} />
              : ''
            }
            {
              images.length === 0 && requestReceived
              && <h1>There is no image</h1>
            }
          </div>
        </div>
        <div className="right">
          <RightPanel page={page} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
