import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

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
        this.setState({ render:true })
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
                {
                    this.state.render
                    ? (
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

                            
                            <Button variant="contained" color="primary" type="submit">Signup</Button>
                            <br />
                            <span className="userError">{this.state.usernameAlreadyUsed}</span>
                            <br/>
                            <Link to="/login">You already have an account?</Link>
                        </form>
                    )
                    : ''
                }
            </div>
        );
    }

}

export default Signup;