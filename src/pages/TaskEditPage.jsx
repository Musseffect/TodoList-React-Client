







import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {setTitle,handleError} from "../actions/actions.js";
import { fetchTaskIfNeeded } from '../actions/taskActions.js';
import api from '../api/api.js';

const mapStateToProps=function(state,ownProps){
  const {id} = ownProps.match.params;
  let task = state.tasks.items[id];
  if(task===undefined){
      task = {
          isLoading:false,
          subTasks:[],
          id:-1,
          title:"",
          createdAt:"",
          completed:false
      };
  }
  return {
    ...task,
    taskFetchingError:state.ui.taskFetchingError,
    error:state.ui.taskUpdateError
  };
};

const mapDispatchToProps=function(dispatch){
  return ({
      fetchTask:function(id,token){dispatch(fetchTaskIfNeeded(id,token));},
      updateTask:function(action){dispatch(action);},
      handleError:function(message,type){dispatch(handleError(message,type));}
  });
};

class TaskEditPage extends Component {
  constructor(props){
      super(props);
      this.state = {title:this.props.title,id:this.props.id};
      this.onSubmit = this.onSubmit.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
  }
  componentDidMount(){
    setTitle("Task edit page");
    this.props.fetchTask(this.props.match.params.id,this.props.token);
  }
  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.id !== state.id) {
      return {
        id: props.id,
        title: props.title
      };
    }
    return null;
  }
  onInputChange(e){
    const target = e.target;
    const value = target.type === 'checkbox'? target.checked: target.value;
    const name = target.name;
    this.setState({[name]:value});
  }
  onSubmit(e){
    e.preventDefault();
    let {title} = this.state;
    //this.props.updateTask(this.props.id,{title:taskTitle,completed:this.props.completed},this.props.token);
    let {history,completed,updateTask,handleError,id,token} = this.props;
    api.updateTask(id,{title,completed},token)
        .then(
        response =>{
                if(response.ok){
                    history.push(`/tasks/${id}`);
                    updateTask({type:UPDATE_TASK,data,id});
                }
                else
                    throw new Error("Cannot update task");
            }
        ).catch(error => handleError(error.message,"taskUpdateError"))
  }
  isValidTask(){
      return this.state.title.length>0&&this.state.title!=this.props.title;
  }
  render() {
    let {error,id} = this.props;
    let {title} = this.state;
    return (
        <form onSubmit={this.onSubmit}>
            <input type="text" className="form-control" name="title" onChange={this.onInputChange} value={title} required/>
            <button className="btn btn-outline-primary" disabled={!this.isValidTask()} type="submit">Save</button>
            <Link className="btn btn-outline-secondary" to={`/tasks/${this.props.match.params.id}`}>Cancel</Link>
            <div className="errorMessage">{error}</div>
        </form>
    )
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TaskEditPage));