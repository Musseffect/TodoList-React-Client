import React, { Component } from 'react';
import TaskListPage from '../pages/TaskListPage.jsx';
import TaskPage from '../pages/TaskPage.jsx';
import NoMatchPage from '../pages/NoMatchPage.jsx';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import LoginPage from '../pages/LoginPage.jsx';
import { handleError } from '../actions/actions.js';
import { connect } from 'react-redux';
import TaskEditPage from '../pages/TaskEditPage.jsx';


const PrivateRoute = ({component:Component,token,...props})=>(
    <Route {...props} render={(props)=>(
      token?
      <Component {...props} token={token}/>:
      <Redirect to={{pathname:"/login",state:{from:props.location}}}/>
      )}/>
)

const mapStateToProps=function(state)
{
    return {
    };
}

const mapDispatchToProps=function(dispatch)
{
return ({
  handleError:function(message,type){dispatch(handleError(message,type))}
});
};


class App extends Component {
  constructor(props){
    super(props);
    let {cookies} = this.props;
    var params = new URLSearchParams(window.location.hash.slice(1));
    let error = params.get("error");
    if(error){
        loginError = params.get("error_description");
        history.pushState("", document.title, window.location.pathname+ window.location.search);
        this.props.handleError(loginError,"loginError");
        return;
    }
    let token = params.get("access_token");
    if(token){
        /*let date = new Date(Date.now() + params.get("exp"));
        date = date.toUTCString();*/
        let state = localStorage.getItem("state");
        if(state!=decodeURI(params.get("state"))){
          console.log("Invalid state");//something something csrf, not sure about it
          return;
        }
        cookies.set("access_token",token,{maxAge:parseInt(params.get("expires_in"))});
        localStorage.removeItem("state");
    }
    history.pushState("", document.title, window.location.pathname+ window.location.search);
  }
  componentDidMount(){
  }
  render() {
    let {cookies,history} = this.props;
    let token = cookies.get("access_token");
    let isLogged = (token!==undefined);
      return (
      <div className="container">
          <div className="d-flex flex-row my-2 justify-content-between">
            <Link to="/" className="h3">TODO LIST IS BACK ON THE MENU, BOYS!</Link>
            {isLogged&&<button className="btn btn-outline-dark" onClick={()=>{cookies.remove("access_token");history.push("/")}}>Logout</button>}
          </div>
          <Switch>
            <PrivateRoute exact path='/' token={token} component={TaskListPage} />
            <PrivateRoute path='/tasks/:id/edit' token={token} component={TaskEditPage} />
            <PrivateRoute exact path='/tasks/:id' token={token} component={TaskPage} />
            <Route path='/login' render={(props)=>isLogged?(<Redirect to="/"/>):(<LoginPage cookies={cookies} {...props}/>)}/>
            <Route path="*" component={NoMatchPage} />
          </Switch>
      </div>);
  }
}

export default withRouter(withCookies(connect(mapStateToProps,mapDispatchToProps)(App)));