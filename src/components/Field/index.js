import React from 'react';

class Field extends React.Component {

    state = {
        input: React.createRef()
    }

    render() {
        const { field, type, content, validation, handleInputChange } = this.props;

        return (
            <label htmlFor={field}>
                <input onChange={handleInputChange} name={field} placeholder={content} id={field} type={type} />
                <br />
                <span className="help-block">{validation[field].message}</span>
                <br />
            </label>
        );
    }
}

export default Field;