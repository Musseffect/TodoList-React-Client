

const taskResource = "http://localhost:8080/tasks";

const api = {
    fetchTask:function(id){
        return fetch(`${taskResource}/${id}`,{
            method:'GET'
        });
    },
    fetchTaskList:function(){
        return fetch(taskResource,{
            method:'GET'
        });
    },
    updateTask:function(id,data){
        return fetch(`${taskResource}/${id}`,{
            method:'PUT',
            body:JSON.stringify(data)
        });
    },
    updateSubTask:function(taskId,id,data){
        return fetch(`${taskResource}/${taskId}/subtasks/${id}`,{
            method:'PUT',
            body:JSON.stringify(data)
        });
    },
    removeTask:function(id){
        return fetch(`${taskResource}/${id}`,{
            method:'DELETE'
        });
    },
    removeSubTask:function(taskId,id){
        return fetch(`${taskResource}/${taskId}/subtasks/${id}`,{
            method:'DELETE'
        });
    },
    addTask:function(data){
        return fetch(taskResource,{
            method:'POST',
            body:JSON.stringify(data)
        });
    },
    addSubTask:function(taskId,data){
        return fetch(`${taskResource}/${taskId}`,{
            method:'POST',
            body:JSON.stringify(data)
        });
    }
};

export default api;