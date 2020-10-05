import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {addSubTask,updateSubTask,removeSubTask} from "../actions/subTaskActions.js";
import {setTitle} from "../actions/actions.js";
import { fetchTaskIfNeeded,  requestUpdateTask } from '../actions/taskActions.js';
import Loader from '../containers/loader.jsx';
import api from '../api/api.js';
import { Link } from 'react-router-dom';

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
        fetchTask:function(id,token){dispatch(fetchTaskIfNeeded(id,token));},
        requestUpdateTask:function(id,data,token){dispatch(requestUpdateTask(id,data,token));},
        removeSubTask:function(taskId,id,token){dispatch(removeSubTask(taskId,id,token));},
        updateSubTask:function(taskId,id,data,token){dispatch(updateSubTask(taskId,id,data,token));},
        addSubTask:function(id,data,token){dispatch(addSubTask(id,data,token));}
    });
};


class TaskPage extends Component {
    constructor(props){
        super(props);
        this.state = {subTaskTitle:""};
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubTaskSubmit = this.onSubTaskSubmit.bind(this);
        this.onSubTaskUpdate = this.onSubTaskUpdate.bind(this);
        this.onRemoveSubTask = this.onRemoveSubTask.bind(this);
        this.onTaskUpdate = this.onTaskUpdate.bind(this);
    }
    componentDidMount(){
        setTitle("Task");
        this.props.fetchTask(this.props.match.params.id,this.props.token);
    }
    onInputChange(e){
        const target = e.target;
        const value = target.type === 'checkbox'? target.checked: target.value;
        const name = target.name;
        this.setState({[name]:value});
    }
    onTaskUpdate(e){
        let {updateTask,title,completed,id,token} = this.props;
        updateTask(id,{completed,title},token);
    }
    onSubTaskSubmit(e){
        this.props.addSubTask(this.props.id,{title:this.state.subTaskTitle},this.props.token);
        e.preventDefault();
    }
    onSubTaskUpdate(id,data){
        this.props.updateSubTask(this.props.id,id,data,this.props.token);
    }
    onRemoveSubTask(id){
        this.props.removeSubTask(this.props.id,id,this.props.token);
    }
    isValidSubTask(){
        return this.state.subTaskTitle.length>0;
    }
    render(){
        let {subTasks,isLoading,id,completed,title,createdAt,taskFetchingError} = this.props;
        let {subTaskTitle} = this.state;
        if(taskFetchingError){
            return (<div className="errorMessage">{taskFetchingError}</div>);
        }
        return (
        <div>
            <Loader isLoading={isLoading}>
                <div className="d-flex flex-column mb-2">
                    <div className="d-flex flex-row align-items-center justify-content-between">
                        <input className="mr-2" onChange={()=>console.log("WHAAA")} type="checkbox" checked={completed}/>
                        <div>{title}</div>
                        <Link className="btn btn-outline-primary" to={`/tasks/${this.props.match.params.id}/edit`}>Edit</Link>
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
                                <input onChange={()=>this.onSubTaskUpdate(item.id,{completed:!item.completed,title:item.title})} type="checkbox" checked={item.completed}/>
                                <div>{item.title}</div>
                                <button className="btn btn-outline-danger" onClick={()=>this.onRemoveSubTask(item.id)}>Delete</button>
                            </li>);
                    },this)}
                </ul>
            </Loader>
        </div>);
    }
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TaskPage));