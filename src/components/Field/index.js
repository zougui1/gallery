import React from 'react';
import TextField from '@material-ui/core/TextField';

class Field extends React.Component {

    state = {
        input: React.createRef()
    }

    render() {
        const { field, type, content, validation, handleInputChange } = this.props;

        return (
            <span>
                <TextField onChange={handleInputChange} name={field} label={content} id={field} type={type} />
                <br />
                {validation ? <span className="help-block">{validation[field].message}</span> : ''}
                <br />
            </span>
        );
    }
}

export default Field;