import React from 'react';

import './login.scss';

import { on, emit } from '../../socket/login';
import { fields, validations } from '../../data/loginFields';
import FormValidator from '../FormValidator/';
import Field from '../Field/';
import auth from '../../services/auth';

class Signup extends React.Component {

    constructor() {
        super();

        this.validator = new FormValidator(validations);

        this.state = {
            username: '',
            password: '',
            validation: this.validator.valid(),
            errorMessage: ''
        }

        this.submitted = false;
    }

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
            emit.login({ username, password });
            on.logged(() => {
                window.location = '/upload';
                auth.isAuthenticated = true;
            });
            on.passwordIncorrect(message => this.setState({ errorMessage: message }));
            on.userNotFound(message => this.setState({ errorMessage: message }));
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

                    
                    <button type="submit">Login</button>
                    <br />
                    <span className="userError">{this.state.errorMessage}</span>
                </form>
            </div>
        );
    }

}

export default Signup;