import React from 'react'

import { connect } from 'react-redux'

import InputChips from '../InputChips';
import { mapDynamicState } from '../../utils';

const mapStateToProps = mapDynamicState('tagsList', 'init');
const TagsInput = ({ tags, handleChange, tagsList, handleFocus, handleBlur }) => {
    return (
        <InputChips
            suggestions={tagsList}
            value={tags}
            handleChange={handleChange}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
        />
    );
}

export default connect(mapStateToProps)(TagsInput);
