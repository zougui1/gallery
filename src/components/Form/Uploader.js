import React from 'react'
import uploadcare from 'uploadcare-widget';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TagsInput from '../TagsInput';

import { connect } from 'react-redux';
import { uploader } from '../../store/actions';
import { mapDynamicState, inArray } from '../../utils';

import { emit, on } from '../../socket/upload';
import { fields } from '../../data/uploaderFields';
import Field from '../Field';

const {
  changeFormView,
  changeImageData,
} = uploader;


const mapStateToProps = state => ({
  tagsList: state.initReducer.tagsList,
  loggedUsername: state.authReducer.loggedUsername,
})

const mapDispatchToProps = dispatch => ({ 
  changeFormView: view => dispatch(changeFormView(view)),
  changeImageData: imageData => dispatch(changeImageData(imageData)),
 });

class Uploader extends React.Component {

  state = {
    overlayCheckbox: React.createRef(),
    artistName: '',
    artistLink: '',
    characterName: '',
    tags: [],
    nsfwCheckbox: React.createRef(),
    overlay: false,
    nsfw: false,
    tagsInputActive: false,
  }

  handleFiles = e => {
    const files = e.target.files;
    this.setState({ file: files[0] });
  }

  submitHandler = e => {
    e.preventDefault();
    const {
      file,
      overlay,
      artistName,
      artistLink,
      characterName,
      nsfw,
      tags,
      tagsInputActive
    } = this.state;
    if(!tagsInputActive && file) {
      const tagsName = tags.map(tag => tag.value);
      const { tagsList } = this.props;
      const formData = {
        artistName,
        artistLink,
        characterName,
        username: this.props.loggedUsername,
        tags: tagsName,
        isNsfw: nsfw,
      }
      
      const newTags = tagsName.filter(tag => !inArray(tag, tagsList, 'value'));
      if(nsfw) {
        const nsfwTag = formData.tags.filter(tag => tag.toLowerCase() === 'nsfw');
        if(nsfwTag.length === 0) formData.tags.push('NSFW');
      } else formData.tags.push('SFW');

      if(!/https?:\/\//.test(formData.artistLink)) formData.artistLink = 'https://' + formData.artistLink;
      
      if(newTags.length > 0) emit.createTags(newTags);
      if(!overlay) {
        const fileUpload = uploadcare.fileFrom('object', file);
        
        fileUpload.done(file => {emit.uploadImage({...formData, image: file.uuid + '/' + file.sourceInfo.file.name});console.log(file)});
        console.log(formData)
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener('load', () => {
          this.props.changeImageData({ 
            ...formData,
            imageTemp64: reader.result
          });
          this.props.changeFormView('Overlay');
        });
      }
    }
  }

  handleInputChange = e => {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleCheckboxChange = name => () => {
    const checkboxElement = this.state[name + 'Checkbox'];
    const checked = checkboxElement.current.props.checked;

    this.setState({
      [name]: !checked
    });
  }
  
  handleTagsInputChange = tags => this.setState({ tags });

  handleTagsInputFocus = () => this.setState({ tagsInputActive: true });
  handleTagsInputBlur = () => this.setState({ tagsInputActive: false });


  render() {
    const { overlayCheckbox, nsfwCheckbox, tags, overlay, nsfw } = this.state;
    const {
      submitHandler,
      handleCheckboxChange,
      handleTagsInputChange,
      handleInputChange,
      handleTagsInputFocus,
      handleTagsInputBlur,
    } = this;

    return (
      <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
        <form>
          <label htmlFor="overlay">Draw an overlay?</label>
          <Checkbox
            onClick={handleCheckboxChange('overlay')}
            onChange={handleCheckboxChange('overlay')}
            checked={overlay}
            name="overlay"
            value="true"
            id="overlay"
            ref={overlayCheckbox}
          /><br/>

          {fields.map(field => (
            <Field
                key={field.field}
                field={field.field}
                content={field.content}
                type={field.type || 'text'}
                handleInputChange={handleInputChange}
                onChange={handleTagsInputFocus}
                onFocus={handleTagsInputBlur}
            />
          ))}


          <TagsInput tags={tags} handleChange={handleTagsInputChange} />


          <br/>
          <label htmlFor="nsfw">NSFW</label>
          <Checkbox
            onClick={handleCheckboxChange('nsfw')}
            onChange={handleCheckboxChange('nsfw')}
            checked={nsfw}
            name="nsfw"
            id="nsfw"
            value="true"
            ref={nsfwCheckbox}
          />

          <br/>
          <input style={{display: 'none'}} id="image" type="file" accept="image/*" onChange={files => this.handleFiles(files)} />
          <label htmlFor="image">
            <Button variant="contained" component="span">
              Browser
            </Button>
          </label>

          <br />
          <br />
          <Button color="primary" onClick={submitHandler} variant="contained" type="submit">Submit</Button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
