import React from 'react';

import './signup.scss';

import { on, emit } from '../../socket/signup';
import { fields, validations } from '../../data/signupFields';
import FormValidator from '../FormValidator/';
import Field from '../Field/';

class Signup extends React.Component {

    constructor() {
        super();

        this.validator = new FormValidator(validations);

        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            validation: this.validator.valid(),
            usernameAlreadyUsed: false,
            userCreated: false
        }

        this.submitted = false;
    }

    passwordMatch = (confirmation, state) => (state.password === confirmation);

    handleInputChange = e => {
        e.preventDefault();

        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitHandler = e => {
        e.preventDefault();
        
        const validation = this.validator.validate(this.state);
        this.setState({ validation });
        this.submitted = true;

        if (validation.isValid) {
            const { username, password } = this.state;
            emit.signup({ username, password });
            on.usernameAlreadyUsed(message => this.setState(message));
            on.userCreated(() => window.location = '/');
        }
    }

    render() {
        let validation = this.submitted ?
                         this.validator.validate(this.state) :
                         this.state.validation 

        return (
            <div>
                <form onSubmit={this.submitHandler}>
                    {fields.map(field => (
                        <Field
                            key={field.field}
                            field={field.field}
                            content={field.content}
                            type={field.type || 'text'}
                            validation={validation}
                            handleInputChange={this.handleInputChange}
                        />
                    ))}

                    
                    <button type="submit">Signup</button>
                    <br />
                    <span className="userError">{this.state.usernameAlreadyUsed}</span>
                </form>
            </div>
        );
    }

}

export default Signup;