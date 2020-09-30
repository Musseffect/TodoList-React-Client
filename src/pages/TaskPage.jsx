import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {addSubTask,updateSubTask,removeSubTask} from "../actions/subTaskActions.js";
import {setTitle} from "../actions/actions.js";
import { fetchTaskIfNeeded,  updateTask } from '../actions/taskActions.js';
import Loader from '../containers/loader.jsx';

const mapStateToProps=function(state,ownProps)
{  
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
        taskFetchingError:state.ui.taskFetchingError
    };
}

const mapDispatchToProps=function(dispatch)
{
return ({
    fetchTask:function(id){dispatch(fetchTaskIfNeeded(id));},
    updateTask:function(id,data){dispatch(updateTask(id,data));},
    removeSubTask:function(id){dispatch(removeSubTask(id));},
    updateSubTask:function(id,data){dispatch(updateSubTask(id,data));},
    addSubTask:function(data){dispatch(addSubTask(data));},
    setTitle:function(title){dispatch(setTitle(title));}
});
};


class TaskPage extends Component {
    constructor(props){
        super(props);
        this.state = {isEdited:false,taskTitle:"",subTaskTitle:""};
        this.onInputChange = this.onInputChange.bind(this);
        this.onTaskChangesSubmit = this.onTaskChangesSubmit.bind(this);
        this.onSubTaskSubmit = this.onSubTaskSubmit.bind(this);
        this.onSubTaskChange = this.onSubTaskChange.bind(this);
        this.onRemoveSubTask = this.onRemoveSubTask.bind(this);
    }
    componentDidMount(){
        this.props.fetchTask(this.props.match.params.id);
        this.props.setTitle("Task");
    }
    onInputChange(e){
        const target = e.target;
        const value = target.type === 'checkbox'? target.checked: target.value;
        const name = target.name;
        this.setState({[name]:value});
    }
    onTaskChangesSubmit(e){
        let {taskTitle} = this.state;
        this.props.updateTask(this.props.id,{title:taskTitle,completed:this.props.completed});
        e.preventDefault();
    }
    onSubTaskSubmit(e){
        this.props.addSubTask(this.props.id,this.state.subTaskTitle);
    }
    onSubTaskChange(id,data){
        this.props.updateSubTask(this.props.id,id,data);
    }
    onRemoveSubTask(id){
        this.props.removeSubTask(this.props.id,id);
    }
    isValidTask(){
        return this.state.taskTitle.length>0;
    }
    isValidSubTask(){
        return this.state.subTaskTitle.length>0;
    }
    render(){
        let {subTasks,isLoading,id,completed,title,createdAt,taskFetchingError} = this.props;
        let {subTaskTitle,taskTitle,isEdited} = this.state;
        if(taskFetchingError){
            return (<div className="errorMessage">{taskFetchingError}</div>);
        }
        let query = new URLSearchParams(this.props.location.search);
        if(query.get("edit")&&!isLoading){
            this.setState({isEdited:true,taskTitle:this.props.title});
        }
        if(isEdited){
            return (
                <form onSubmit={this.onTaskChangesSubmit}>
                    <input type="text" name="taskTitle" onChange={this.onInputChange} value={taskTitle} required/>
                    <button disabled={!this.isValidTask()} type="submit">Save</button>
                    <button onClick={()=>this.setState({isEdited:false})}>Cancel</button>
                </form>
            );
        }else{
            return (
            <div>
                <Loader isLoading={isLoading}>
                    <div className="d-flex flex-column mb-2">
                        <div className="d-flex flex-row align-items-center justify-content-between">
                            <input className="mr-2" onChange={()=>console.log("WHAAA")} type="checkbox" value={completed}/>
                            <div>{title}</div>
                            <button className="btn btn-outline-primary" onClick={()=>this.setState({isEdited:true})}>Edit</button>
                        </div>
                        <small className="text-muted align-self-end">{"Created "+createdAt}</small>
                    </div>
                    <form onSubmit={this.onSubTaskSubmit}>
                        <div className="input-group mb-2">
                            <input className="form-control" type="text" onChange={this.onInputChange} name="subTaskTitle" value={subTaskTitle}/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" disabled={!this.isValidSubTask()}>Add subtask</button>
                            </div>
                        </div>
                    </form>
                    <ul className="list-group">
                        {subTasks.map(function(item){
                            return (
                                <li className="list-group-item justify-content-between d-flex flex-row align-items-center" key={item.id}>
                                    <input onChange={()=>this.onSubTaskChange(item.id,{completed:!item.completed})} type="checkbox" value={item.completed}/>
                                    <div>{item.title}</div>
                                    <button className="btn btn-outline-danger" onClick={()=>this.onRemoveSubTask(item.id)}>Delete</button>
                                </li>);
                        })}
                    </ul>
                </Loader>
            </div>);
        }
    }
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TaskPage));