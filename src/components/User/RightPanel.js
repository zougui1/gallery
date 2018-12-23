import React, { Component } from 'react'
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';

import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';
import TagsInput from '../TagsInput';
import { emit, on } from '../../socket/user';

const {
  displayOverlay,
  setFilter,
  setImages,
  setFilteredImages,
} = gallery;

const mapStateToProps = mapDynamicState({
  gallery: 'showOverlay filteredImages getFilteredImages filter',
  auth: 'loggedUsername',
});

const mapDispatchToProps = dispatch => ({
  displayOverlay: showOverlay => dispatch(displayOverlay(showOverlay)),
  setFilter: filter => dispatch(setFilter(filter)),
  setImages: images => dispatch(setImages(images)),
  setFilteredImages: images => dispatch(setFilteredImages(images)),
});
class RightPanel extends Component {
  state = {
    inputTags: [],
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.filter !== this.props.filter) {
      console.log(this.props)
      emit.getImagesByUserAndTags({
        username: this.props.username,
        tags: this.props.filter,
        page: this.props.page,
      });
      on.retrieveImagesFromDB(images => {
        this.props.setImages(images);
        this.props.setFilteredImages(images);
      })
    }
  }


  handleChange = () => {
    let { showOverlay, displayOverlay } = this.props;
    const newShowOverlay = {
      ...showOverlay,
      all: !showOverlay.all
    };
    displayOverlay(newShowOverlay);
  }

  handleFilterChange = e => {
    const { value } = e.target;
    this.props.setFilter(value);
  }

  handleTagsInputChange = tags => {
    let tagsArrayOfString = tags.map(tag => typeof tag === 'string' ? tag : tag.value);
    if(tagsArrayOfString.length === 0) tagsArrayOfString = ['everything']
    this.props.setFilter(tagsArrayOfString);
    const inputTags = tagsArrayOfString.map(tag => tag.toLowerCase() !== 'everything' && { value: tag, label: tag });
    this.setState({ inputTags });
  };

  render() {
    const { handleTagsInputChange, handleChange } = this;
    const { showOverlay } = this.props;
    return (
      <div>
        <div style={{color: '#fff', marginTop: '65px'}} className="colors color-picker-panel">
          <div className="panel-row">
            <label htmlFor="showOverlay">Display overlay</label>
            <Checkbox
              onClick={handleChange}
              onChange={handleChange}
              checked={showOverlay.all}
              name="showOverlay"
              id="showOverlay"
            />

            <br/>
            <TagsInput tags={this.state.inputTags} handleChange={handleTagsInputChange} />
            </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);
