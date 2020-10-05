import api from "../api/api";
import { handleError } from "./actions";

export const REMOVE_TASK = "REMOVE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const ADD_TASK = "ADD_TASK";
export const REQUEST_TASKS = "REQUEST_TASKS";
export const RECEIVE_TASKS = "RECEIVE_TASKS";
export const REQUEST_TASK = "REQUEST_TASK";
export const RECEIVE_TASK = "RECEIVE_TASK";
export const ERROR_RECEIVING_TASK = "ERROR_RECEIVING_TASK";
export const ERROR_RECEIVING_TASKS = "ERROR_RECEIVING_TASKS";


export var removeTask = function(id,token){
    return function(dispatch){
        return api.removeTask(id,token)
            .then(
            response =>{
                    if(response.ok)
                        dispatch({type:REMOVE_TASK,id});
                    else
                        throw new Error("Cannot remove task");
                }
            ).catch(error => dispatch(handleError(error.message,"taskRemoveError")))
    };
}

export var requestUpdateTask = function(id,data,token){
    return function(dispatch){
        return api.updateTask(id,data,token)
            .then(
            response =>{
                    if(response.ok)
                        dispatch({type:UPDATE_TASK,data,id})
                    else
                        throw new Error("Cannot update task");
                }
            ).catch(error => dispatch(handleError(error.message,"taskUpdateError")))
    };
}

export var addTask = function(data,token){
    return function(dispatch){
        dispatch({type:ADD_TASK});
        return api.addTask(data,token)
            .then(
            response =>{
                    if(response.ok)
                        response.json().then(json=>dispatch({id:json.id,data:{...json,isLoading:false,subTasks:[]},type:UPDATE_TASK}));
                    else
                        throw new Error("Cannot add task");
                }
            ).catch(error => dispatch(handleError(error.message,"taskPostingError")))
    };
}

var requestTasks = function(){
    return {type:REQUEST_TASKS};
}
var handleTasksFetchingError = function(message){
    return {type:ERROR_RECEIVING_TASKS,message};
}
var receiveTasks = function(tasks){
    return {type:RECEIVE_TASKS,tasks}
}

var fetchTasks = function(token){
    return function(dispatch){
        dispatch(requestTasks());
        return api.fetchTaskList(token)
            .then(
            response => {
                if(response.ok)
                    response.json().then(json=>dispatch(receiveTasks(json)));
                else
                    throw new Error("Cannot load tasks");
                }
            ).catch(error => dispatch(handleTasksFetchingError(error.message)));
    };
}

function shouldFetchTasks(state){
    const CACHE_TIME_MS = 1000*60*5;
    const isCached = (Date.now() - state.tasks.updatedAt<CACHE_TIME_MS);
    return !isCached;
}

export var fetchTasksIfNeeded = function(token){
    return (dispatch,getState)=>{
        if(shouldFetchTasks(getState()))
            return dispatch(fetchTasks(token));
    }
}
var requestTask = function(id){
    return {type:REQUEST_TASK,id};
}
var handleTaskFetchingError = function(id,message){
    return {type:ERROR_RECEIVING_TASK,message,id};
}
var receiveTask = function(taskJson){
    return {type:RECEIVE_TASK,task:{...taskJson.task,subTasks:taskJson.subTasks}};
}

var fetchTask = function(id,token){
    return function(dispatch){
        dispatch(requestTask(id));
        return api.fetchTask(id,token)
            .then(
            response =>{
                    if(response.ok)
                        response.json().then(json=>dispatch(receiveTask(json)))
                    else
                        throw new Error("Cannot load task");
                }
            ).catch(error => dispatch(handleTaskFetchingError(id,error.message)))
    };
}
function shouldFetchTask(state,id){
    const task = state.tasks.items[id];
    if(task!==undefined){
        const CACHE_TIME_MS = 1000*60*5;
        const isCached = (task.subTasks===undefined?false:(Date.now() - task.updatedAt<CACHE_TIME_MS));
        return !isCached;
    }
    return true;
}
export var fetchTaskIfNeeded = function(taskId,token){
    return (dispatch,getState)=>{
        if(shouldFetchTask(getState(),taskId))
            return dispatch(fetchTask(taskId,token));
    }
}