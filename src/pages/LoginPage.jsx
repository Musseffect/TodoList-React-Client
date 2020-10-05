import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import {setTitle} from "../actions/actions.js";
import {auth} from "../api/auth.js";

const mapStateToProps=function(state){
  return {
    error:state.ui.loginError
  };
};

const mapDispatchToProps=function(dispatch){
  return ({
  });
};

class LoginPage extends Component {
  constructor(props){
      super(props);
      this.onSubmit = this.onSubmit.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
  }
  componentDidMount(){
    let location = this.props.location;
    let {from} = location.state || { from: { pathname: "/" } };
    this.from = from;
    //console.log(from);
    setTitle("Login page");
  }
  onInputChange(e){
    const target = e.target;
    const value = target.type === 'checkbox'? target.checked: target.value;
    const name = target.name;
    this.setState({[name]:value});
  }
  onSubmit(e){
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let state = "";
    for (let i = 0; i < 40; i++)
      state += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    localStorage.setItem("state", state);
    //console.log(state);
    auth(state);
  }
  render() {
    let {error} = this.props;
    return (
      <div>
          {error&&<div>{error}</div>}
            {/*<div className="form-row form-group"><input className="form-control" name="username" type="text" onChange={this.onInputChange} value={login} placeholder="Username" required/></div>
            <div className="form-row form-group"><input className="form-control" name="password" type="password" autoComplete="on" onChange={this.onInputChange} value={password} placeholder="Password" required/></div>
          */}<div className="form-row form-group"><button className="btn btn-outline-primary" onClick={this.onSubmit} >Log In</button></div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(LoginPage));