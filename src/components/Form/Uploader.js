import React from 'react'
import ReactFileReader from 'react-file-reader';
import uploadcare from 'uploadcare-widget';

class Uploader extends React.Component {

  state = {
    checkboxOverlay: React.createRef(),
  }

  handleFiles = files => {
    if(!this.state.checkboxOverlay.current.checked) {
      console.log(files);
      const file = uploadcare.fileFrom('object', files[0]);

      file.done(file => console.log('file uploaded'))
    } else {
      const reader = new FileReader();
      const img = files[0];
      reader.readAsDataURL(img);

      reader.addEventListener('load', () => this.props.addImageTemp({imageTemp64: reader.result}))
    }

    this.props.setView('Overlay');
  }

  render() {
    return (
      <div>
        <input type="checkbox" name="overlay" value="true" id="overlay" ref={this.state.checkboxOverlay} />
        <label htmlFor="overlay">Draw an overlay?</label>
        <ReactFileReader handleFiles={files => this.handleFiles(files)}>
          <button>Upload an image</button>
        </ReactFileReader>
      </div>
    );
  }
}

export default Uploader;