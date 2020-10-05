import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {setTitle} from "../actions/actions.js";
import { fetchTasksIfNeeded, addTask, removeTask, requestUpdateTask } from '../actions/taskActions.js';
import Task from '../components/Task.jsx';
import Loader from '../containers/loader.jsx';


const mapStateToProps=function(state)
{
    return {
        tasks:Object.values(state.tasks.items),
        taskPostingError:state.ui.taskPostingError,
        taskListFetchingError:state.ui.taskListFetchingError,
        isLoading:state.tasks.isLoading
    };
}

const mapDispatchToProps=function(dispatch)
{
return ({
    fetchTasksIfNeeded:function(token){dispatch(fetchTasksIfNeeded(token,token));},
    addTask:function(data,token){dispatch(addTask(data,token));},
    removeTask:function(id,token){dispatch(removeTask(id,token));},
    requestUpdateTask:function(id,data,token){dispatch(requestUpdateTask(id,data,token));}
});
};


class TaskListPage extends Component {
    constructor(props){
        super(props);
        this.state = {taskTitle:""};
        this.onInputChange = this.onInputChange.bind(this);
        this.onTaskSubmit = this.onTaskSubmit.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }
    componentDidMount(){
        setTitle("TaskList");
        this.props.fetchTasksIfNeeded(this.props.token);
    }
    onInputChange(e){
        const target = e.target;
        const value = target.type === 'checkbox'? target.checked: target.value;
        const name = target.name;
        this.setState({[name]:value});
    }
    onTaskSubmit(e){
        let {taskTitle} = this.state;
        this.props.addTask({title:taskTitle},this.props.token);
        e.preventDefault();
    }
    clearForm(e){
        this.setState({taskTitle:""});
    }
    isValid(){
        return this.state.taskTitle.length>0;
    }
    onUpdate(id,data){
        this.props.requestUpdateTask(id,data,this.props.token);
    }
    onRemove(id){
        this.props.removeTask(id,this.props.token);
    }
    render(){
        let {taskTitle} = this.state;
        let {submitting,isLoading,tasks,taskPostingError,taskListFetchingError} = this.props;
        return (
        <div>
            <Loader isLoading={isLoading}>
                {taskListFetchingError?
                (<div className="errorMessage" id="taskListError">
                    {taskListFetchingError}
                </div>):(<form id="taskForm" onSubmit={this.onTaskSubmit}>
                    {taskPostingError&&<div className="errorMessage">{taskPostingError}</div>}
                    <div className="input-group mb-2">
                        <input className="form-control" id="taskTitle" name="taskTitle" value={taskTitle}  placeholder="Title" onChange={this.onInputChange} required/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" disabled={!this.isValid()||submitting} type="submit">Add new task</button>
                        </div>
                    </div>
                </form>)}
                <div className="list-group">
                    {tasks.map(function(item){
                        return <Task key={item.id} {...item} onRemove = {this.onRemove} onUpdate = {this.onUpdate}></Task>
                    },this)}
                </div>
            </Loader>
        </div>);
    }
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TaskListPage));

