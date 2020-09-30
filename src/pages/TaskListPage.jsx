import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {setTitle} from "../actions/actions.js";
import { fetchTasksIfNeeded, addTask, removeTask, updateTask } from '../actions/taskActions.js';
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
    fetchTasksIfNeeded:function(){dispatch(fetchTasksIfNeeded());},
    addTask:function(data){dispatch(addTask(data));},
    removeTask:function(id){dispatch(removeTask(id));},
    updateTask:function(data){dispatch(updateTask(data));},
    setTitle:function(title){dispatch(setTitle(title));}
});
};


class TaskListPage extends Component {
    constructor(props){
        super(props);
        this.state = {taskTitle:""};
        this.onInputChange = this.onInputChange.bind(this);
        this.onTaskSubmit = this.onTaskSubmit.bind(this);
    }
    componentDidMount(){
        this.props.setTitle("TaskList");
        this.props.fetchTasksIfNeeded();
    }
    onInputChange(e){
        const target = e.target;
        const value = target.type === 'checkbox'? target.checked: target.value;
        const name = target.name;
        this.setState({[name]:value});
    }
    onTaskSubmit(e){
        let {taskTitle} = this.state;
        this.props.addTask({title:taskTitle});
        e.preventDefault();
    }
    clearForm(e){
        this.setState({taskTitle:""});
    }
    isValid(){
        return this.state.taskTitle.length>0;
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
                        return <Task key={item.id} {...item}></Task>
                    })}
                </div>
            </Loader>
        </div>);
    }
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TaskListPage));

