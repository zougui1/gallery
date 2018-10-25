import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import './login.scss';

import { on, emit } from '../../socket/login';
import { fields, validations } from '../../data/loginFields';
import FormValidator from '../FormValidator';
import Field from '../Field';
import { mapDynamicState } from '../../utils';
import { login } from '../../actions';

const mapStateToProps = mapDynamicState(['loggedUsername']);
const mapDispatchToProps = (dispatch) => ({ 
  login: (username) => dispatch(login(username)),
});
class Signup extends React.Component {

    validator = new FormValidator(validations);
    submitted = false;

    state = {
        username: '',
        password: '',
        validation: this.validator.valid(),
        errorMessage: '',
        logged: false
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
        if(!this.state.username) console.log('t')

        if (validation.isValid) {
            const { username, password } = this.state;
            emit.login({ username, password });
            on.logged(() => {
                this.props.login(username);
                localStorage.setItem('username', username);
                this.setState({logged: true});
            });
            on.passwordIncorrect((message) => this.setState({ errorMessage: message }));
            on.userNotFound((message) => this.setState({ errorMessage: message }));
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
                {this.state.logged
                    ? <Redirect to="/upload" />
                    : false}
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);