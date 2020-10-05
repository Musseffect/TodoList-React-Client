import api from "../api/api";
import { handleError } from "./actions";

export const REMOVE_SUBTASK = "REMOVE_SUBTASK";
export const RECEIVE_SUBTASK = "RECEIVE_SUBTASK";

export var receiveSubTask = function(taskId,data){
    return {type:RECEIVE_SUBTASK,taskId,data};
}

export var addSubTask = function(taskId,data,token){
    return function(dispatch){
        return api.addSubTask(taskId,data,token)
            .then(
            response =>{
                    if(response.ok)
                        response.json().then(json=>dispatch(receiveSubTask(taskId,json)))
                    else
                        throw new Error("Cannot add subtask");
                }
            ).catch(error => dispatch(handleError(error.message,"taskPostingError")));
    };
}
export var updateSubTask = function(taskId,id,data,token){
    return function(dispatch){
        return api.updateSubTask(taskId,id,data,token)
            .then(
            response =>{
                    if(response.ok)
                        dispatch(receiveSubTask(taskId,{...data,id:id}))
                    else
                        throw new Error("Cannot update subtask");
                }
            ).catch(error => dispatch(handleError(error.message,"taskUpdatingError")));
    };
}
export var removeSubTask = function(taskId,id,token){
    return function(dispatch){
        return api.removeSubTask(taskId,id,token)
            .then(
            response =>{
                    if(response.ok)
                        return dispatch({type:REMOVE_SUBTASK,taskId,id});
                    else
                        throw new Error("Cannot remove subtask");
                }
            ).catch(error => dispatch(handleError(error.message,"taskRemovingError")));
    };
}