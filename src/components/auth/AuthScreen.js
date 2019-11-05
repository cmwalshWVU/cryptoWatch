import React, { Component } from 'react'
import { connect } from 'react-redux';
import { signIn, signUp } from '../store/actions/authActions';
import { Redirect } from 'react-router-dom'
import '../../styles/card.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class AuthScreen extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        selectedTab: 0
    }

    componentDidMount() {
        if(this.props.tab !== undefined) {
            this.setState({selectedTab: this.props.tab})
        }
      }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        if (this.state.selectedTab === 0) {
            this.props.signIn(this.state);
        }
        else {
            this.props.signUp(this.state);
        }
    }

    handleTabChange = (tab) => {
        this.setState({selectedTab: tab})
    }

    render() {
        const { authError, auth } = this.props;
        if (auth.uid) return <Redirect to='/' />
        return (            
            <div className="auth-card rounded-card  container">
                <form onSubmit={this.handleSubmit} className="auth-form rounded-card  white">
                <Tabs className="auth-tabs" value={this.state.selectedTab} onChange={this.handleTabChange} aria-label="authTabs">
                    <Tab label="Sign In" onClick={() => this.handleTabChange(0)} />
                    <Tab label="Sign Up" onClick={() => this.handleTabChange(1)} />
                </Tabs>
                {this.state.selectedTab === 0 ?
                    <>
                    {/* <h5 className="grey-text text-darken-3">Sign In</h5> */}
                    <div className="input-field">
                        <label htmlFor="email"> Email</label>
                        <input type="email" id="email" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password"> Password</label>
                        <input type="password" id="password" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Login</button>
                        <div className="red-text center">
                            { authError ? <p> {authError} </p> : null }
                        </div>
                    </div>
                    </>
                : 
                <>
                    {/* <h5 className="grey-text text-darken-3">Sign Up</h5> */}
                    <div className="input-field">
                        <label htmlFor="email"> Email</label>
                        <input type="email" id="email" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password"> Password</label>
                        <input type="password" id="password" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="firstName"> First Name</label>
                        <input type="text" id="firstName" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName"> Last Name</label>
                        <input type="text" id="lastName" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Sign Up</button>
                        <div className="red-text center">
                            { authError ? <p> {authError }</p> : null}
                        </div>
                    </div>
                    </>
                }
                </form>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds)),
        signUp: (newUser) => dispatch(signUp(newUser))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
