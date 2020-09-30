export const UPDATE_SUBTASK = "UPDATE_SUBTASK";
export const REMOVE_SUBTASK = "REMOVE_SUBTASK";
export const ADD_SUBTASK = "ADD_SUBTASK";


export var addSubTask = function(data){
    return {type:ADD_SUBTASK,data};
}
export var updateSubTask = function(id,data){
    return {type:UPDATE_SUBTASK,id,data};

}
export var removeSubTask = function(id){
    return {type:REMOVE_SUBTASK,id};
}