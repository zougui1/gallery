import React from 'react';
import { connect } from 'react-redux';

import Uploader from './Uploader';
import Overlay from './Overlay';

import './form.scss';

const mapStateToProps = state => ({ view: state.uploaderReducer.view });
const Form = ({ view }) =>  {
    const components = { Uploader: Uploader, Overlay: Overlay }
    const Component = components[view];
    return <Component />
}

export default connect(mapStateToProps)(Form);