import React from 'react';

import './signup.scss';

import { on, emit } from '../../socket/signup';
import { fields, validations } from '../../data/signupFields';
import FormValidator from '../FormValidator';
import Field from '../Field/index';

class Signup extends React.Component {

    state = {
        username: '',
        password: '',
        confirmPassword: '',
        validation: null,
        usernameAlreadyUsed: false,
        userCreated: false,
        validator: new FormValidator(validations),
        submitted: false
    }

    componentDidMount = () => {
        this.setState({ validation: this.state.validator.valid() });
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
        
        const validation = this.state.validator.validate(this.state);
        this.setState({ validation, submitted: true });

        if (validation.isValid) {
            const { username, password } = this.state;
            emit.signup({ username, password });
            on.usernameAlreadyUsed((message) => this.setState(message));
            //on.userCreated(() => window.location = '/');
        }
    }

    render() {
        let validation = this.state.submitted ?
                         this.state.validator.validate(this.state) :
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