import React, { Component } from 'react'
import { connect } from 'react-redux';

import { mapDynamicState } from '../../utils';
import { gallery } from '../../store/actions';
import TagsInput from '../TagsInput';

const {
  displayOverlay,
  setFilter,
} = gallery;

const mapStateToProps = mapDynamicState('showOverlay filteredImages getFilteredImages', 'gallery');

const mapDispatchToProps = dispatch => ({
  displayOverlay: showOverlay => dispatch(displayOverlay(showOverlay)),
  setFilter: filter => dispatch(setFilter(filter)),
});
class RightPanel extends Component {

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
    let tagsArrayOfString = tags.map(tag => tag.value);
    if(tagsArrayOfString.length === 0) tagsArrayOfString = ['everything']
    this.props.setFilter(tagsArrayOfString);
  };

  render() {
    const { handleTagsInputChange } = this;
    return (
      <div>
        <div style={{color: '#fff'}} className="colors color-picker-panel">
          <div className="panel-row">
            <label htmlFor="showOverlay">Display overlay</label>
            <input onChange={this.handleChange} checked={this.props.showOverlay.all} type="checkbox" name="showOverlay" id="showOverlay" />
            <br/>
            <TagsInput tags={this.props.filter} handleChange={handleTagsInputChange} />
            </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel);