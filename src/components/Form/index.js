import React from 'react';
import { connect } from 'react-redux';

import Uploader from './Uploader';
import Overlay from './Overlay';
import { uploader } from '../../store/actions/';

import './form.scss';

const {
    resetReducer,
} = uploader;


const mapStateToProps = state => ({ view: state.uploaderReducer.view });
const mapDispatchToProps = dispatch => ({
    resetReducer: () => dispatch(resetReducer()),
})
class Form extends React.Component  {
    componentDidMount = () => {
      this.props.resetReducer();
    }
    
    render() {
    const components = { Uploader: Uploader, Overlay: Overlay }
    const Component = components[this.props.view];
    return <Component />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);