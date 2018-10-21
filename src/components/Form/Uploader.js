import React from 'react'
import uploadcare from 'uploadcare-widget';

import { emit } from '../../socket/upload';

class Uploader extends React.Component {

  state = {
    checkboxOverlay: React.createRef(),
  }

  handleFiles = e => {
    const files = e.target.files;
    if(!this.state.checkboxOverlay.current.checked) {
      const file = uploadcare.fileFrom('object', files[0]);

      file.done(file => emit.uploadImage({ image: file.uuid }));
    } else {
      const reader = new FileReader();
      const img = files[0];
      reader.readAsDataURL(img);

      reader.addEventListener('load', () => this.props.addImageTemp({imageTemp64: reader.result}))
      this.props.setView('Overlay');
    }
  }

  render() {
    return (
      <div>
        <input type="checkbox" name="overlay" value="true" id="overlay" ref={this.state.checkboxOverlay} />
        <label htmlFor="overlay">Draw an overlay? (check it, there is no upload yet)</label>
        <input type="file" accept="image/*" onChange={files => this.handleFiles(files)} />
      </div>
    );
  }
}

export default Uploader;