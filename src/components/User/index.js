import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import './user.scss';

import Images from './Images';

import { emit, on } from '../../socket/user';

import RightPanel from './RightPanel';
import Loading from '../Loading';

import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';

const {
  setImages,
  setFilteredImages,
  setCurrentUser,
  setCurrentPage,
  setRequestReceived,
} = gallery;

const mapStateToProps = mapDynamicState('showOverlay images filter requestReceived', 'gallery');
const mapDispatchToProps = dispatch => ({
  setImages: images => dispatch(setImages(images)),
  setFilteredImages: images => dispatch(setFilteredImages(images)),
  setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser)),
  setCurrentPage: currentUser => dispatch(setCurrentPage(currentUser)),
  setRequestReceived: received => dispatch(setRequestReceived(received)),
})
export class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      page: 1,
    }
    const { page, username } = this.props.match.params;
    if(page && username) {
      this.props.setCurrentPage(page)
      this.setState({ page, username })
    }
  }

  componentDidMount = () => {
    const username = this.props.match.params.username;
    this.props.setCurrentUser(username)
    this.setState({ username });
    setTimeout(this.request, 0);
  }

  request = () => {
    const { setRequestReceived, setImages, filter } = this.props;
    let req = {
      username: this.state.username,
      page: Number(this.state.page),
      tags: filter,
    };
    emit.getImagesByUserAndTags(req);
    on.retrieveImagesFromDB(images => {
      setImages(images);
      setRequestReceived(true);
    })
  }

  getView = () => {
    const { images, requestReceived } = this.props;
    const { username, page } = this.state;

    if(images.length > 0) {
      return <Images username={username} page={page} />;
    }
    else if(!requestReceived)
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Loading loading={true} size={60} />
        </div>
      );
    else return <h1>There is no image</h1>;
  }

  render() {
    const { page, username } = this.state;

    return (
      <div>
        <div className="left">
          <div className="images-container">
            {this.getView()}
          </div>
        </div>
        <div className="right">
          <RightPanel page={page} username={username} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
