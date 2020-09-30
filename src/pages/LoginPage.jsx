import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import {setTitle,login} from "../actions/actions.js";

const mapStateToProps=function(state){
  return {
    error:state.login.error
  };
};

const mapDispatchToProps=function(dispatch){
  return ({
    setTitle:function(title){dispatch(setTitle(title));},
  });
};

class LoginPage extends Component {
  constructor(props){
      super(props);
      this.state = {username:"",password:""};
      this.onSubmit = this.onSubmit.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
  }
  componentDidMount(){
    let location = this.props.location;
    let {from} = location.state || { from: { pathname: "/" } };
    this.from = from;
    this.props.setTitle("Login page");
  }
  onInputChange(e){
    const target = e.target;
    const value = target.type === 'checkbox'? target.checked: target.value;
    const name = target.name;
    this.setState({[name]:value});
  }
  onSubmit(e){
    let {cookies,history} = this.props;
    let state = "state";
    cookies.set("state",state);
    login(state);
    //cookies.set("access_token","huj");
    //history.replace(this.from);
    //history.push("/");
    //e.preventDefault();
  }
  render() {
    let {location,error} = this.props;
    let {login,password} = this.state;
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