import React, { Component } from 'react';
import TaskListPage from '../pages/TaskListPage.jsx';
import TaskPage from '../pages/TaskPage.jsx';
import NoMatchPage from '../pages/NoMatchPage.jsx';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import LoginPage from '../pages/LoginPage.jsx';


const PrivateRoute = ({component:Component,cookies,...props})=>(
    <Route {...props} render={(props)=>(
      cookies.get("access_token")?
      <Component {...props}/>:
      <Redirect to={{pathname:"/login",state:{from:props.location}}}/>
      )}/>
)


class App extends Component {
  constructor(props){
    super(props);
    let {cookies} = this.props;
    var params = new URLSearchParams(window.location.hash.slice(1));
    let error = params.get("error");
    if(error){
        //loginError = params.get("error_description");
        return;
    }
    let token = params.get("access_token");
    if(token){
        /*let date = new Date(Date.now() + params.get("exp"));
        date = date.toUTCString();*/
        let state = cookies.get("state");
        if(state!=params.get("state")){
          console.log("Invalid state");//something something csrf, not sure about it
          return;
        }
        cookies.set("access_token",token,{maxAge:parseInt(params.get("expires_in"))});
        cookies.remove("state");
    }
    history.pushState("", document.title, window.location.pathname+ window.location.search);
  }
  componentDidMount(){
  }
  render() {
    let {cookies,history} = this.props;
    let isLogged = (cookies.get("access_token")!==undefined);
      return (
      <div className="container">
          <div className="d-flex flex-row my-2 justify-content-between">
            <Link to="/" className="h3">TODO LIST IS BACK ON THE MENU, BOYS!</Link>
            {isLogged&&<button className="btn btn-outline-dark" onClick={()=>{cookies.remove("access_token");history.push("/")}}>Logout</button>}
          </div>
          <Switch>
            <PrivateRoute exact path='/' cookies={cookies} component={TaskListPage} />
            <PrivateRoute path='/tasks/:id' cookies={cookies} component={TaskPage} />
            <Route path='/login' render={(props)=>isLogged?(<Redirect to="/"/>):(<LoginPage cookies={cookies} {...props}/>)}/>
            <Route path="*" component={NoMatchPage} />
          </Switch>
      </div>);
  }
}

export default withRouter(withCookies(App));