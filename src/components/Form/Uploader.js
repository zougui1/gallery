import React from 'react'
import uploadcare from 'uploadcare-widget';
import { connect } from 'react-redux';
import { changeFormView, changeImageData } from '../../actions/';

import { emit } from '../../socket/upload';

const mapDispatchToProps = dispatch => ({ 
  changeFormView: view => dispatch(changeFormView(view)),
  changeImageData: imageData => dispatch(changeImageData(imageData)),
 });

class Uploader extends React.Component {

  state = {
    checkboxOverlay: React.createRef(),
    artistNameInput: React.createRef(),
    artistLinkInput: React.createRef(),
    characterNameInput: React.createRef(),
    tagsSelect: React.createRef(),
    nsfwCheckbox: React.createRef(),
  }

  handleFiles = e => {
    const files = e.target.files;
    this.setState({ file: files[0] });
  }

  submitHandler = e => {
    e.preventDefault();
    const { file, checkboxOverlay, artistNameInput, artistLinkInput, characterNameInput, nsfwCheckbox, tagsSelect } = this.state;
    const formData = {
      artistName: artistNameInput.current.value,
      artistLink: artistLinkInput.current.value,
      characterName: characterNameInput.current.value,
      tag: tagsSelect.current.value,
      isNsfw: nsfwCheckbox.current.checked,
    }
    
    if(!checkboxOverlay.current.checked) {
      const fileUpload = uploadcare.fileFrom('object', file);
      
      fileUpload.done(file => emit.uploadImage({...formData, image: file.uuid}));
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

  render() {
    const { checkboxOverlay, artistNameInput, artistLinkInput, characterNameInput, nsfwCheckbox, tagsSelect } = this.state;
    const { submitHandler } = this;

    return (
      <div>
        <form onSubmit={submitHandler}>
          <input type="checkbox" name="overlay" value="true" id="overlay" ref={checkboxOverlay} />
          <label htmlFor="overlay">Draw an overlay?</label><br />

          <label htmlFor="artistName">Artist name</label>
          <input type="text" id="artistName" name="artistName" ref={artistNameInput} /><br />

          <label htmlFor="artistLink">Artist link</label>
          <input type="text" id="artistLink" name="artistLink" ref={artistLinkInput} /><br />

          <label htmlFor="characterName">Character name</label>
          <input type="text" id="characterName" name="characterName" ref={characterNameInput} /><br />

          <label htmlFor="tag">Tag</label>
          <select name="tag" id="tag" ref={tagsSelect}>
            <option value="head">Head</option>
            <option value="neckBackTail">Neck, Back, and Tail</option>
            <option value="shouldersArmsHands">Shoulders, Arms, and Hands</option>
            <option value="legs">Legs</option>
            <option value="wings">Wings</option>
          </select>

          <label htmlFor="isNsfw">NSFW</label>
          <input type="checkbox" name="isNsfw" id="isNsfw" value="true" ref={nsfwCheckbox} />

          <input id="image" type="file" accept="image/*" onChange={files => this.handleFiles(files)} />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Uploader);